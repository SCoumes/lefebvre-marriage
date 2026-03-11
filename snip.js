<!-- Paste this into a Squarespace Code Block.
     Replace the URL below with your actual Worker URL if it changes. -->

<div id="wedding-orders">
  <p id="order-summary"></p>
  <p id="next-milestone"></p>
  <ul id="milestones-list"></ul>
  <div id="messages-section"></div>
</div>

<script>
  // Edit milestones here: each has an amount (in EUR) and a text description.
  const MILESTONES = [
    { amount: 100, text: "quelque chose se passera" },
    { amount: 500, text: "autre chose se passera" },
  ];

  const fmt = (val, cur) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: cur || 'EUR' }).format(val);

  fetch('https://wed.simon-0fc.workers.dev/total')
    .then(r => r.json())
    .then(({ total, currency, orderCount, messages }) => {
      total = parseFloat(total);

      document.getElementById('order-summary').innerHTML =
        `Total des commandes : <strong>${fmt(total, currency)}</strong> (${orderCount} commandes)`;

      const next = MILESTONES.find(m => m.amount > total);
      if (next) {
        document.getElementById('next-milestone').textContent =
          `Plus que ${fmt(next.amount - total, currency)} et ${next.text} !`;
      }

      const ul = document.getElementById('milestones-list');
      for (const m of MILESTONES) {
        const li = document.createElement('li');
        li.textContent = `${fmt(m.amount, currency)} — ${m.text}`;
        if (total >= m.amount) li.style.color = 'green';
        ul.appendChild(li);
      }

      if (messages.length > 0) {
        const section = document.getElementById('messages-section');
        section.innerHTML = '<p><strong>Petits mots :</strong></p>';
        const msgList = document.createElement('ul');
        for (const msg of messages) {
          const li = document.createElement('li');
          li.textContent = msg;
          msgList.appendChild(li);
        }
        section.appendChild(msgList);
      }
    })
    .catch(() => {
      document.getElementById('order-summary').textContent = 'Indisponible';
    });
</script>
