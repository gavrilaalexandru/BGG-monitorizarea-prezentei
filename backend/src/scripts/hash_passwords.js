const prisma = require("../prisma");
const bcrypt = require("bcrypt");

async function main() {
  const users = await prisma.user.findMany();
  for (const user of users) {
    const hashed = await bcrypt.hash("defaultpassword", 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed },
    });
    console.log(`Password hashed for user ${user.id}`);
  }
}

main()
  .then(() => {
    console.log("All passwords hashed!");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
