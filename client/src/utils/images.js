import { CHARACTER_IMAGES } from '../constants/images';
import ranger1 from '../assets/characters/ranger1.svg';

export const getCharacterImage = imageName => {
    if (!imageName) return ranger1;

    const image = CHARACTER_IMAGES.find(image => image.name === imageName);
    if (!image) return ranger1;
    return image.image;
}