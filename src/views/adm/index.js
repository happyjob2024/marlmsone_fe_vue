import axios from 'axios';

export const axiosAction = async (url, param) => {
    try {
        const result = await axios.post(url, param);
        return result.data;
    } catch (error) {
        return null;
    }
};
