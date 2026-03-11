<!-- Paste this into a Squarespace Code Block.
     Replace the URL below with your actual Render service URL. -->
<p>Total orders: <strong id="order-total">…</strong></p>

<script>
  fetch('https://wedding-orders-total.onrender.com/total')
    .then(r => r.json())
    .then(data => {
      const amount = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: data.currency || 'EUR'
      }).format(data.total);
      document.getElementById('order-total').textContent =
        amount + ' (' + data.orderCount + ' commandes)';
    })
    .catch(() => {
      document.getElementById('order-total').textContent = 'Indisponible';
    });
</script>
