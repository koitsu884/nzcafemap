import React, { PureComponent } from "react";
import ReactCrop from "react-image-crop";
// import 'react-image-crop/lib/ReactCrop.scss';

const MIN_SIZE = 100;

class ImageUploader extends PureComponent {
  constructor(props) {
    super(props);
    let aspect = props.aspect ? props.aspect : 1 / 1;
    this.state = {
      src: null,
      fileName: null,
      crop: {
        unit: "px",
        width: 200,
        aspect: aspect
      },
      blob: null,
      error: null
    };
  }

  onSelectFile = e => {
    this.setState({ error: null })
    if (e.target.files && e.target.files.length > 0) {
      let file = e.target.files[0];
      if (!file.type.includes("image/")) {
        this.setState({ error: "サポートされていないファイルタイプです" })
        return;
      }
      const reader = new FileReader();
      const fileName = e.target.files[0].name;
      reader.onload = () => {
        var img = new Image();

        img.onload = () => {
          if (img.width <= MIN_SIZE || img.height <= MIN_SIZE) {
            this.setState({ error: `${MIN_SIZE} x ${MIN_SIZE} 以上の画像を指定してください` })
            return;
          }
          this.setState({ src: reader.result, fileName: fileName })
        }
        img.src = reader.result;
      }

      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // If you setState the crop in here you should return false.
  onImageLoaded = image => {
    this.imageRef = image;
  };

  onCropComplete = crop => {
    this.makeClientCrop(crop);
  };

  onCropChange = crop => {
    this.setState({ crop });
  };

  onClickSubmit = () => {
    const { blob } = this.state;
    if (blob) {
      this.props.onUploadPhoto(blob);
    }
  }

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        this.state.fileName
      );
      this.setState({ croppedImageUrl });
    }
  }

  getCroppedImg(image, crop, fileName) {
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    let destWidth = crop.width * scaleX;
    let destHeight = crop.height * scaleY;
    if (this.props.maxSize) {
      let aspect = destWidth / destHeight;
      if (destWidth > destHeight) {
        if (destWidth > this.props.maxSize) {
          destWidth = this.props.maxSize;
          destHeight = this.props.maxSize / aspect;
        }
      }
      else {
        if (destHeight > this.props.maxSize) {
          destHeight = this.props.maxSize;
          destWidth = this.props.maxSize / aspect;
        }
      }
    }
    const canvas = document.createElement("canvas");
    // canvas.width = crop.width;
    // canvas.height = crop.height;
    canvas.width = destWidth;
    canvas.height = destHeight;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX, //Src pos
      crop.y * scaleY,
      crop.width * scaleX, //Src size
      crop.height * scaleY,
      0, //Dest pos
      0,
      // crop.width,
      // crop.height
      destWidth, //Dest size
      destHeight
    );

    return new Promise((resolve, reject) => {
      if (canvas.toBlob) {
        canvas.toBlob(blob => {
          if (!blob) {
            //reject(new Error('Canvas is empty'));
            console.error("Canvas is empty");
            return;
          }
          blob.name = fileName;
          window.URL.revokeObjectURL(this.fileUrl);
          this.fileUrl = window.URL.createObjectURL(blob);
          resolve(this.fileUrl);
          this.setState({ blob });
        }, "image/jpeg");
      }
      else if (canvas.msToBlob) {
        let blob = canvas.msToBlob();

        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error("Canvas is empty");
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
        this.setState({ blob });
      }
    });

  }

  render() {
    const { crop, croppedImageUrl, src, error } = this.state;

    return (
      <div className="squareImageUploader">
        <div className="squareImageUploader__fileSelector">
          <div className="inputButton">
            <label htmlFor="squareImageUpload">ファイルを選択してください</label>
            <input id="squareImageUpload" type="file" accept="image/*" title={"画像ファイルを選択"} onChange={this.onSelectFile} />
          </div>
          {error && (
            <p className="error">{error}</p>
          )}
          {src && (
            <ReactCrop
              minWidth={100}
              minHeight={100}
              maxHeight={300}
              src={src}
              crop={crop}
              onImageLoaded={this.onImageLoaded}
              onComplete={this.onCropComplete}
              onChange={this.onCropChange}
              className="squareImageUploader__selector"
            />
          )}
        </div>
        {croppedImageUrl && (
          <div className="squareImageUploader__preview">
            <img alt="preview" src={croppedImageUrl} />
            <button type="button" className="btn" onClick={this.onClickSubmit}>OK!!</button>
          </div>
        )}
      </div>
    );
  }
}

export default ImageUploader;