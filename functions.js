// Function that creates HTMLElement img, set image source and className, and return this object
function createIMG(/*string: relative source of the image*/src, /*string: the name of the image class*/classname)
{
    let img = document.createElement('img')
    img.setAttribute('src', src)
    img.className = classname
    return img;
}
