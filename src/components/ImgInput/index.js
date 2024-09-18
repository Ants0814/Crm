import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import './style.css';
import { faBorderStyle } from '@fortawesome/free-solid-svg-icons';

const ImgInput = React.forwardRef(({ setImageUrl,  setAlign, setWidth, setHeight }, ref) => {
  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState([]);

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    margin: '5px 0px 0px 0px',
    boxSizing: 'border-box',
    borderStyle:'dotted',
    borderWidth:'1px',
    borderColor:'#eee',
    borderRadius: '8px',
    gridColumn :'span 4',
  };

  const uploadAreaStyle = {
    display: 'flex',
    justifyContent: setAlign || 'flex-start',
    alignItems: 'center',
    width: '100%',
    overflowX: 'auto',
    scrollbarWidth: 'thin',
    scrollbarColor: '#6c757d #e9ecef',
    margin:'0px',
  };

  const uploadLabelStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: setWidth || '200px',
    height: setHeight || '125px',
    border: `2px dashed ${dragOver ? '#4a90e2' : '#ced4da'}`,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: dragOver ? 'rgba(74, 144, 226, 0.1)' : '#ffffff',
    flexShrink: 0,
    margin:'0px 15px 0px 0px'
  };

  const imageContainerStyle = {
    position: 'relative',
    width: setWidth || '200px',
    height: setHeight || '125px',
    marginRight: '15px',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
  };

  const deleteButtonStyle = {
    position: 'absolute',
    top: '5px',
    right: '5px',
    background: 'rgba(255, 255, 255, 0.9)',
    border: 'none',
    borderRadius: '50%',
    width: '25px',
    height: '25px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    opacity: 0,
  };

  const fileChangeHandler = event => {
    let files = Array.from(event.target.files);
    processFiles(files);
   
  };

  const processFiles = (files) => {
    Promise.all(files.map(file => {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onloadend = event => {
          let image = new Image();
          image.src = event.target.result;
          image.onload = () => {
            // Extract the file name and extension
            const fileName = file.name;
            const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
            
            resolve({
              url: reader.result, 
              width: image.width, 
              height: image.height,
              name: fileName, // Add file name
              extension: fileExtension // Add file extension
            });
          };
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }))
    .then(newImages => {
      setPreviewUrl(prevImages => [...prevImages, ...newImages]);
      if (newImages.length > 0) {
        setImageUrl(prevImages => [...prevImages, ...newImages]);
      }
    }, error => console.error(error));
  };

  const onDragStart = (e, index) => {
    e.dataTransfer.setData("index", index);
  };

  const onDrop = (e, targetIndex) => {
    e.preventDefault();
    const draggedIndex = parseInt(e.dataTransfer.getData("index"));
    swapImage(draggedIndex, targetIndex);
  };

  const swapImage = (draggedIndex, targetIndex) => {
    setPreviewUrl(prevState => {
      let newState = [...prevState];
      [newState[draggedIndex], newState[targetIndex]] = [newState[targetIndex], newState[draggedIndex]];
      return newState;
    });
  };

  const deleteImage = (index) => {
    setPreviewUrl(prevState => prevState.filter((_, i) => i !== index));
    setImageUrl(prevState => prevState.filter((_, i) => i !== index));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  return (
    <main style={containerStyle}>
      <div style={uploadAreaStyle}>
        <input 
          type="file" 
          accept="image/*" 
          onChange={fileChangeHandler} 
          id="file" 
          className="input-file" 
          multiple 
          ref={ref}
          style={{ display: 'none' }}
        />
        <label
          className="upload-label"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          htmlFor="file"
          style={uploadLabelStyle}
        >
          <Upload size={30} color="#4a90e2" />
          <span style={{ marginTop: '10px', color: '#4a90e2', fontWeight: 500,fontSize:'15px' }}>Upload Images</span>
        </label>
        {previewUrl &&
          previewUrl.map((imageData, index) => (
            <div 
              className='imgLoader' 
              style={imageContainerStyle}
              key={index} 
              draggable 
              onDragStart={(e) => onDragStart(e, index)} 
              onDrop={(e) => onDrop(e, index)}
              onDragOver={(e) => { e.preventDefault(); }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.querySelector('img').style.transform = 'scale(1.1)';
                e.currentTarget.querySelector('button').style.opacity = 1;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.querySelector('img').style.transform = 'scale(1)';
                e.currentTarget.querySelector('button').style.opacity = 0;
              }}
            >
              <img
                src={imageData.url}
                style={{
                  ...imageStyle,
                  width: imageData.width > imageData.height ? '100%' : 'auto',
                  height: imageData.height >= imageData.width ? '100%' : 'auto'
                }}
              />
              <button style={deleteButtonStyle} onClick={() => deleteImage(index)}>
                <X size={16} color="#ff6b6b" />
              </button>
            </div>
          ))
        }
      </div>
    </main>
  );
});

export default ImgInput;