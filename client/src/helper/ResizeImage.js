function resizeImage(src, maxSize, destFileName) {
    return new Promise((resolve, reject) => {
        let image = new Image();
        image.onerror = reject;
        image.onload = () => {
            var width, height;
            if (image.width > image.height) {
                let ratio = image.height / image.width;
                width = maxSize;
                height = maxSize * ratio;
            } else {
                let ratio = image.width / image.height;
                width = maxSize * ratio;
                height = maxSize;
            }

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");

            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);
            if(ctx.canvas.toBlob)
            {
                ctx.canvas.toBlob((blob) => {
                    const resizedFile = new File([blob], destFileName, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    });
                    resolve(resizedFile);
                })
            } else if (ctx.canvas.msToBlob){
                var uri = ctx.canvas.toDataURL('image/jpeg', 0.85);
                let blob = toBlob(uri);
                let resizedFile = new Blob([blob], destFileName, {type: 'image/jpeg'});
                resizedFile['lastModified'] = Date.now();
                resolve(resizedFile);
            }
        }
        image.src = src;
    })
}

//For IE
function toBlob(base64) {
	var bin = atob(base64.replace(/^.*,/, ''));
	var buffer = new Uint8Array(bin.length);
	for (var i = 0; i < bin.length; i++) {
		buffer[i] = bin.charCodeAt(i);
	}
	var blob = new Blob([buffer.buffer], {type: 'image/jpeg'});
	return blob;
}

export default async function resizeFile(file, maxSize) {
    return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.onload = event => {
            resizeImage(event.target.result, maxSize, file.name)
                .then(resizedFile => {
                    resolve(resizedFile);
                })
                .catch(error => {
                    reject(error);
                })
        }
        reader.onerror = reject;
        reader.readAsDataURL(file);
    })
}