import { prisma } from '@/lib/prisma'
import { getInitialItems, getInventoryCapacity } from './items-data'
import { ItemSizeConfig, EquipmentSlots } from '@/types/inventory'

interface Item {
  id: string
  name: string
  description: string
  category: string
  type: string
  weight: number
  size: string
  value: number
  rarity: string
  properties?: any
  requirements?: any
  isStackable: boolean
  maxStack: number
  icon?: string
  professionSpecific?: string
  createdAt: Date
  updatedAt: Date
}

interface Inventory {
  id: string
  characterId: string
  maxWeight: number
  maxSlots: number
  currentWeight: number
  usedSlots: number
  createdAt: Date
  updatedAt: Date
  slots?: InventorySlot[]
}

interface InventorySlot {
  id: string
  inventoryId: string
  itemId: string
  item?: Item
  quantity: number
  slotPosition: number
  isEquipped: boolean
  equippedSlot: string | null
  createdAt: Date
  updatedAt: Date
}

export class InventoryService {
  // Criar inventário para um personagem
  static async createInventory(characterId: string, profession: string): Promise<Inventory> {
    const capacity = getInventoryCapacity(profession)
    
    const inventory = await prisma.inventory.create({
      data: {
        characterId,
        maxWeight: capacity.maxWeight,
        maxSlots: capacity.maxSlots,
        currentWeight: 0,
        usedSlots: 0
      }
    })

    // Adicionar itens iniciais
    await this.addInitialItems(inventory.id, profession)

    return inventory
  }

  // Adicionar itens iniciais ao inventário
  static async addInitialItems(inventoryId: string, profession: string): Promise<void> {
    const initialItems = getInitialItems(profession)
    
    for (const itemData of initialItems) {
      // Criar o item no banco de dados
      const item = await prisma.item.create({
        data: {
          ...itemData,
          properties: itemData.properties || {}
        }
      })

      // Adicionar ao inventário
      await this.addItemToInventory(inventoryId, item.id, itemData.isStackable ? itemData.maxStack : 1)
    }
  }

  // Adicionar item ao inventário
  static async addItemToInventory(
    inventoryId: string, 
    itemId: string, 
    quantity: number = 1
  ): Promise<InventorySlot | null> {
    const inventory = await prisma.inventory.findUnique({
      where: { id: inventoryId },
      include: { slots: { include: { item: true } } }
    })

    if (!inventory) {
      throw new Error('Inventário não encontrado')
    }

    const item = await prisma.item.findUnique({ where: { id: itemId } })
    if (!item) {
      throw new Error('Item não encontrado')
    }

    // Verificar capacidade de peso
    const totalWeight = inventory.currentWeight + (item.weight * quantity)
    if (totalWeight > inventory.maxWeight) {
      throw new Error('Peso excede a capacidade máxima do inventário')
    }

    // Verificar se o item já existe no inventário (para stack)
    if (item.isStackable) {
      const existingSlot = inventory.slots.find(slot => slot.itemId === itemId)
      if (existingSlot) {
        const newQuantity = existingSlot.quantity + quantity
        if (newQuantity > item.maxStack) {
          throw new Error(`Quantidade excede o máximo de ${item.maxStack} itens`)
        }

        const updatedSlot = await prisma.inventorySlot.update({
          where: { id: existingSlot.id },
          data: { quantity: newQuantity }
        })

        // Atualizar peso do inventário
        await this.updateInventoryWeight(inventoryId)
        return updatedSlot
      }
    }

    // Encontrar slot vazio
    const emptySlot = this.findEmptySlot(inventory.slots, inventory.maxSlots)
    if (!emptySlot) {
      throw new Error('Inventário cheio')
    }

    // Criar novo slot
    const newSlot = await prisma.inventorySlot.create({
      data: {
        inventoryId,
        itemId,
        quantity,
        slotPosition: emptySlot
      }
    })

    // Atualizar peso e slots usados do inventário
    await this.updateInventoryWeight(inventoryId)
    await this.updateUsedSlots(inventoryId)

    return newSlot
  }

  // Remover item do inventário
  static async removeItemFromInventory(
    inventoryId: string, 
    slotId: string, 
    quantity: number = 1
  ): Promise<void> {
    const slot = await prisma.inventorySlot.findUnique({
      where: { id: slotId },
      include: { item: true, inventory: true }
    })

    if (!slot || slot.inventoryId !== inventoryId) {
      throw new Error('Slot não encontrado no inventário')
    }

    if (quantity > slot.quantity) {
      throw new Error('Quantidade maior que a disponível no slot')
    }

    if (quantity === slot.quantity) {
      // Remover o slot completamente
      await prisma.inventorySlot.delete({ where: { id: slotId } })
    } else {
      // Reduzir quantidade
      await prisma.inventorySlot.update({
        where: { id: slotId },
        data: { quantity: slot.quantity - quantity }
      })
    }

    // Atualizar peso e slots usados
    await this.updateInventoryWeight(inventoryId)
    await this.updateUsedSlots(inventoryId)
  }

  // Equipar item
  static async equipItem(inventoryId: string, slotId: string, equipmentSlot: string): Promise<void> {
    const slot = await prisma.inventorySlot.findUnique({
      where: { id: slotId },
      include: { item: true }
    })

    if (!slot) {
      throw new Error('Slot não encontrado')
    }

    // Verificar se o item pode ser equipado naquele slot
    if (!this.canEquipInSlot(slot.item, equipmentSlot)) {
      throw new Error('Este item não pode ser equipado neste slot')
    }

    // Verificar se já há algo equipado neste slot
    const existingEquipped = await prisma.inventorySlot.findFirst({
      where: {
        inventoryId,
        equippedSlot: equipmentSlot,
        isEquipped: true
      }
    })

    if (existingEquipped) {
      // Desequipar o item anterior
      await prisma.inventorySlot.update({
        where: { id: existingEquipped.id },
        data: { isEquipped: false, equippedSlot: null }
      })
    }

    // Equipar o novo item
    await prisma.inventorySlot.update({
      where: { id: slotId },
      data: { isEquipped: true, equippedSlot: equipmentSlot }
    })
  }

  // Desequipar item
  static async unequipItem(inventoryId: string, slotId: string): Promise<void> {
    const slot = await prisma.inventorySlot.findUnique({
      where: { id: slotId }
    })

    if (!slot || slot.inventoryId !== inventoryId) {
      throw new Error('Slot não encontrado no inventário')
    }

    await prisma.inventorySlot.update({
      where: { id: slotId },
      data: { isEquipped: false, equippedSlot: null }
    })
  }

  // Obter inventário completo
  static async getInventory(characterId: string): Promise<Inventory | null> {
    return await prisma.inventory.findUnique({
      where: { characterId },
      include: {
        slots: {
          include: { item: true },
          orderBy: { slotPosition: 'asc' }
        }
      }
    })
  }

  // Verificar se item pode ser equipado em determinado slot
  private static canEquipInSlot(item: Item, equippedSlot: string | null): boolean {
    const category = item.category
    const type = item.type

    switch (equippedSlot) {
      case EquipmentSlots.MAIN_HAND:
        return category === 'weapon' && ['sword', 'short_sword', 'staff', 'knife', 'wakizashi', 'walking_staff', 'war_scythe'].includes(type)
      
      case EquipmentSlots.OFF_HAND:
        return category === 'weapon' && ['knife', 'throwing_knife'].includes(type)
      
      case EquipmentSlots.CHEST:
        return category === 'armor' && ['light_armor', 'robes', 'stealth_clothing', 'formal_armor'].includes(type)
      
      case EquipmentSlots.ACCESSORY1:
      case EquipmentSlots.ACCESSORY2:
        return category === 'special' && ['amulet', 'prayer_beads'].includes(type)
      
      default:
        return false
    }
  }

  // Encontrar slot vazio
  private static findEmptySlot(slots: any[], maxSlots: number): number | null {
    const occupiedPositions = slots.map(slot => slot.slotPosition)
    
    for (let i = 1; i <= maxSlots; i++) {
      if (!occupiedPositions.includes(i)) {
        return i
      }
    }
    
    return null
  }

  // Atualizar peso do inventário
  private static async updateInventoryWeight(inventoryId: string): Promise<void> {
    const slots = await prisma.inventorySlot.findMany({
      where: { inventoryId },
      include: { item: true }
    })

    const totalWeight = slots.reduce((sum, slot) => {
      return sum + (slot.item.weight * slot.quantity)
    }, 0)

    await prisma.inventory.update({
      where: { id: inventoryId },
      data: { currentWeight: totalWeight }
    })
  }

  // Atualizar slots usados
  private static async updateUsedSlots(inventoryId: string): Promise<void> {
    const usedSlots = await prisma.inventorySlot.count({
      where: { inventoryId }
    })

    await prisma.inventory.update({
      where: { id: inventoryId },
      data: { usedSlots }
    })
  }

  // Verificar se pode adicionar item
  static async canAddItem(inventoryId: string, itemId: string, quantity: number = 1): Promise<boolean> {
    try {
      const inventory = await prisma.inventory.findUnique({
        where: { id: inventoryId },
        include: { slots: { include: { item: true } } }
      })

      if (!inventory) return false

      const item = await prisma.item.findUnique({ where: { id: itemId } })
      if (!item) return false

      // Verificar peso
      const totalWeight = inventory.currentWeight + (item.weight * quantity)
      if (totalWeight > inventory.maxWeight) return false

      // Verificar slots disponíveis
      if (item.isStackable) {
        const existingSlot = inventory.slots.find(slot => slot.itemId === itemId)
        if (existingSlot) {
          return (existingSlot.quantity + quantity) <= item.maxStack
        }
      }

      const emptySlot = this.findEmptySlot(inventory.slots, inventory.maxSlots)
      return emptySlot !== null

    } catch (error) {
      return false
    }
  }

  // Transferir item entre inventários
  static async transferItem(
    fromInventoryId: string,
    toInventoryId: string,
    slotId: string,
    quantity: number = 1
  ): Promise<void> {
    const slot = await prisma.inventorySlot.findUnique({
      where: { id: slotId },
      include: { item: true }
    })

    if (!slot || slot.inventoryId !== fromInventoryId) {
      throw new Error('Slot não encontrado no inventário de origem')
    }

    if (quantity > slot.quantity) {
      throw new Error('Quantidade maior que a disponível')
    }

    // Verificar se o inventário de destino pode receber o item
    const canAdd = await this.canAddItem(toInventoryId, slot.itemId, quantity)
    if (!canAdd) {
      throw new Error('Inventário de destino não pode receber este item')
    }

    // Adicionar ao inventário de destino
    await this.addItemToInventory(toInventoryId, slot.itemId, quantity)

    // Remover do inventário de origem
    await this.removeItemFromInventory(fromInventoryId, slotId, quantity)
  }
}
