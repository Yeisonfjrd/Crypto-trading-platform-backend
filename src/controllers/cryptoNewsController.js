import CryptoNews from '../models/CryptoNews.js';

const getCryptoNews = async (req, res) => {
    try {
        const news = await CryptoNews.getCryptoNews();
        res.status(200).json({ news });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las noticias', details: error.message });
    }
};

export default { getCryptoNews };