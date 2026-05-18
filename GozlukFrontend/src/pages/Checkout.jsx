import { useState } from "react";

function Checkout({ onBack, cartItems, total }) {
  const [adSoyad, setAdSoyad] = useState("");
  const [adres, setAdres] = useState("");
  const [sehir, setSehir] = useState("");
  const [kartAdi, setKartAdi] = useState("");
  const [kartNo, setKartNo] = useState("");
  const [sonAy, setSonAy] = useState("");
  const [sonYil, setSonYil] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleAdSoyadChange(e) {
    setAdSoyad(e.target.value);
  }

  function handleAdresChange(e) {
    setAdres(e.target.value);
  }

  function handleSehirChange(e) {
    setSehir(e.target.value);
  }

  function handleKartAdiChange(e) {
    setKartAdi(e.target.value);
  }

  function handleKartNoChange(e) {
    const value = e.target.value.replace(/\D/g, "").slice(0, 16);
    setKartNo(value);
  }

  function handleSonAyChange(e) {
    setSonAy(e.target.value);
  }

  function handleSonYilChange(e) {
    setSonYil(e.target.value);
  }

  function handleCvvChange(e) {
    const value = e.target.value.replace(/\D/g, "").slice(0, 3);
    setCvv(value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (adSoyad === "") {
      setError("Ad Soyad boş bırakılamaz.");
      return;
    }
    if (adres === "") {
      setError("Adres boş bırakılamaz.");
      return;
    }
    if (sehir === "") {
      setError("Şehir boş bırakılamaz.");
      return;
    }
    if (kartAdi === "") {
      setError("Kart üzerindeki ad boş bırakılamaz.");
      return;
    }
    if (kartNo.length !== 16) {
      setError("Kart numarası 16 haneli olmalıdır.");
      return;
    }
    if (sonAy === "") {
      setError("Son kullanma ayı boş bırakılamaz.");
      return;
    }
    if (sonYil === "") {
      setError("Son kullanma yılı boş bırakılamaz.");
      return;
    }
    if (cvv.length !== 3) {
      setError("CVV 3 haneli olmalıdır.");
      return;
    }

    setError("");
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="checkout-success">
        <h2>Siparişiniz Alındı!</h2>
        <p>Teşekkür ederiz. Siparişiniz en kısa sürede kargoya verilecektir.</p>
        <button onClick={onBack}>Alışverişe Devam Et</button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <button className="back-btn" onClick={onBack}>← Sepete Dön</button>
      <h2>Ödeme</h2>
      <form onSubmit={handleSubmit}>
        <div className="checkout-row">
          <div className="checkout-col">
            <h3>Teslimat Bilgileri</h3>
            <label>Ad Soyad</label>
            <input
              type="text"
              placeholder="Ad Soyad"
              value={adSoyad}
              onChange={handleAdSoyadChange}
            />
            <label>Adres</label>
            <input
              type="text"
              placeholder="Adres"
              value={adres}
              onChange={handleAdresChange}
            />
            <label>Şehir</label>
            <input
              type="text"
              placeholder="Şehir"
              value={sehir}
              onChange={handleSehirChange}
            />
          </div>

          <div className="checkout-col">
            <h3>Kart Bilgileri</h3>
            <label>Kart Üzerindeki Ad</label>
            <input
              type="text"
              placeholder="Ad Soyad"
              value={kartAdi}
              onChange={handleKartAdiChange}
            />
            <label>Kart Numarası (16 hane)</label>
            <input
              type="text"
              placeholder="1234567890123456"
              value={kartNo}
              onChange={handleKartNoChange}
              maxLength="16"
            />
            <div className="checkout-row">
              <div className="checkout-col">
                <label>Son Kullanma Ayı</label>
                <select value={sonAy} onChange={handleSonAyChange}>
                  <option value="">Ay</option>
                  <option value="01">Ocak</option>
                  <option value="02">Şubat</option>
                  <option value="03">Mart</option>
                  <option value="04">Nisan</option>
                  <option value="05">Mayıs</option>
                  <option value="06">Haziran</option>
                  <option value="07">Temmuz</option>
                  <option value="08">Ağustos</option>
                  <option value="09">Eylül</option>
                  <option value="10">Ekim</option>
                  <option value="11">Kasım</option>
                  <option value="12">Aralık</option>
                </select>
              </div>
              <div className="checkout-col">
                <label>Son Kullanma Yılı</label>
                <select value={sonYil} onChange={handleSonYilChange}>
                  <option value="">Yıl</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                  <option value="2029">2029</option>
                  <option value="2030">2030</option>
                </select>
              </div>
              <div className="checkout-col">
                <label>CVV (3 hane)</label>
                <input
                  type="text"
                  placeholder="123"
                  value={cvv}
                  onChange={handleCvvChange}
                  maxLength="3"
                />
              </div>
            </div>
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        <div className="checkout-total">
          <strong>Toplam: {total.toLocaleString("tr-TR")} ₺</strong>
        </div>

        <button type="submit" className="checkout-btn">Siparişi Tamamla</button>
      </form>
    </div>
  );
}

export default Checkout;