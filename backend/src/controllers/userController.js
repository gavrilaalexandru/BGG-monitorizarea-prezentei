const prisma = require("../prisma");
// crearea unui utilizator cu datele primite din body-ul requestului
exports.createUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const user = await prisma.user.create({
      data: { name, email, role },
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// query la baza de date pentru un return json cu toti utilizatorii
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// query la baza de date pentru un return json cu un utilizator specific, care include si prezenta si grupurile de evenimente
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        eventGroups: true,
        attendances: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
