import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import SvgClose from '../common/SvgIcons/SvgClose';

import Alert from '../../helper/Alert';

export default function MultipleImageUploader(props) {
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    // multiple: props.multiple,
    onDrop: acceptedFiles => {
      let maxNum = props.maxNum ? props.maxNum : 5;
      // let maxSize = props.maxSize ? props.maxSize : 800;

      if (acceptedFiles.length > maxNum) {
        Alert.error(`アップロードできる画像は${maxNum}個までです`)
        return;
      }

      //Setting previews
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
      //Callback function
      props.onImagesSelected(acceptedFiles);
    }
  });

  const thumbs = files.map(file => (
    <div className="imageUploader__preview__item" key={file.path}>
      <img
        src={file.preview}
        alt="preview"
        className="imageUploader__preview__item__image"
      />
      <SvgClose className="imageUploader__preview__item__delete ibtn" onClick={() => {
        let updatedFiles = files.filter(value => value.name !== file.name)
        setFiles(updatedFiles);
        props.onImagesSelected(updatedFiles);
      }} />
    </div>
  ));

  useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <section className="imageUploader">
      <div {...getRootProps({ className: 'imageUploader__dropzone' })}>
        <input {...getInputProps()} />
        <p>クリックして画像を選択<br />（あるいはここにファイルをドロップ）</p>
      </div>
      <aside className="imageUploader__preview">
        {thumbs}
      </aside>
    </section>
  );
}