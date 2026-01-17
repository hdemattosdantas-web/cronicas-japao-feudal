@echo off
echo DATABASE_URL="file:./prisma/dev.db" > .env.local
echo NEXTAUTH_URL="http://localhost:3002" >> .env.local
echo GOOGLE_CLIENT_ID="809396998033-c7fqmtrd2pf5jrjcjlaq2d094lr9so83.apps.googleusercontent.com" >> .env.local
echo GOOGLE_CLIENT_SECRET="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" >> .env.local
echo NEXTAUTH_SECRET="k8FJ3s7A9KxQmPp3L2D1E9zQnYtV0+0xRkA7mE2cQ=" >> .env.local
echo .env.local atualizado com porta 3002
type .env.local