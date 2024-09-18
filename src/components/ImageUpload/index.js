import React, { useRef, useState} from 'react';

export default function ImageUpload(props){

    const inputFiles = useRef();
    const thumbnailImgRef = useRef();
    const photoSubmit = useRef();

    const [uploadFile, setUploadFile] = useState('');

    const uploadImgPreview = () => {
        let fileinfo = inputFiles.current.files[0];
        setUploadFile(fileinfo);
      
        let reader = new FileReader();
        //alert(JSON.stringify(thumbnailImgRef.current));
        reader.onload = () => {
          thumbnailImgRef.current.src = reader.result;
          thumbnailImgRef.current.width = '180';
          thumbnailImgRef.current.height = '180';
        }
        if (fileinfo) {
          reader.readAsDataURL(fileinfo);
        }
      }
      
  // 게시글 목록 초기화
  const clearData = (i) => {
    photoSubmit.current.disabled = false;
    inputFiles.value = null;
    document.getElementById("TextInput").value = null;
    thumbnailImgRef.src = null;
    thumbnailImgRef.width = '0';
    thumbnailImgRef.height = '0';
    }
  
    const uploadImage = () => {
        photoSubmit.current.disabled = 'disabled';
        var form = document.getElementById("myForm");
        var formData = new FormData(form.current);
        //formData.append('userId',Session.UserId);
        fetch('https://file.skynet.re.kr:3402/upload/Image', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body: formData
        }).then((res) =>res.json()).then((msg) => {
            clearData();
        }).catch(err => {
            console.log(err);
        });
    }   


  return (
    <div className="App">
        <form id='myForm' method="POST" encType="multipart/form-data" >
            <div className='ThumbnailView'><img ref={thumbnailImgRef}id="thumbnailImg" src="" /><div id="thumbnailSrc" src="" /></div>
            <input ref={inputFiles} style={{ borderWidth: '0px', display: '' }} id='img' type="file" name="img" onChange={() => uploadImgPreview()} />
        </form>
        <button type='button' style={{ width:150,borderStyle: 'none', backgroundColor: '#fff', margin: '10px', cursor: 'pointer' }} ref={photoSubmit} className='SubmitButton' onClick={() => uploadImage()}>전송</button>
    </div>
  );
}
