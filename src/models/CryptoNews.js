import axios from 'axios';

const getCryptoNews = async () => {
    try {
        const response = await axios.get('https://newsapi.org/v2/everything', {
            params: {
                q: 'cryptocurrency OR bitcoin OR ethereum', 
                sortBy: 'publishedAt',
                language: 'es',
                apiKey: process.env.NEWS_API_KEY,
            }
        });
        return response.data.articles;
    } catch (error) {
        console.error('Error al obtener las noticias:', error);
        throw new Error('No se pudieron obtener las noticias');
    }
};

export default { getCryptoNews };
