// SaaS Virtual App JS code
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize Database
  try {
    await db.runSQL(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT
    )`);
    
    // Seed some initial data if empty
    const users = await db.runSQL(`SELECT * FROM users`);
    if (users && users.length === 0) {
      await db.runSQL(`INSERT INTO users (name, email) VALUES (?, ?)`, ["Ana Gómez", "ana@example.com"]);
      await db.runSQL(`INSERT INTO users (name, email) VALUES (?, ?)`, ["Carlos Ruiz", "carlos@example.com"]);
    }
  } catch (err) {
    console.error("DB Initialization Error: ", err);
  }

  // Render users list
  const renderUsers = async () => {
    const list = document.getElementById('users-list');
    if (!list) return;
    list.innerHTML = '';
    
    try {
      const users = await db.runSQL(`SELECT * FROM users`);
      users.forEach(user => {
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>${user.name}</strong>
          <span class="email">${user.email}</span>
        `;
        list.appendChild(li);
      });
    } catch (err) {
      console.error("Error loading users: ", err);
    }
  };

  await renderUsers();

  // Form handle
  const form = document.getElementById('user-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('username');
      const emailInput = document.getElementById('useremail');
      
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      
      if (name && email) {
        try {
          await db.runSQL(`INSERT INTO users (name, email) VALUES (?, ?)`, [name, email]);
          nameInput.value = '';
          emailInput.value = '';
          await renderUsers();
        } catch (err) {
          alert("Error insertando en la base de datos.");
        }
      }
    });
  }
});