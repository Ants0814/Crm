import React, { useState, useEffect, useContext, createRef } from "react";
import { PostFormContainer, FormTitle, Form, SubmitButton ,FileUploadLabel} from './styled';
import { AppContext } from "../../../AppContext";
import DynamicInput from "./DynamicInput";
import RichTextEditor from '../../RichTextEditor';
import ImgInput from "../../ImgInput";

export const PostForm = ({ formFields,setFormFields, hasContentField, hasTitleField, refrashFlag,setRefrashFlag, closeForm, tableName ,menuConfig}) => {
    const [isSubmitted, setIsSubmitted] = useState(false); // 새 상태 추가
    const [formData, setFormData] = useState({});
    const [editorContent, setEditorContent] = useState('');
    const [photoList, setPhotoList] = useState([]);
    const [rootColumnValues, setRootColumnValues] = useState({}); // root_column 값들 관리
    const PhotoSubmit = createRef();
    const { user } = useContext(AppContext);
    
    // Update component state when formFields, hasContentField, or hasTitleField change
    useEffect(() => {
        //setFormData({});
        setPhotoList([]);
        setRootColumnValues({});
    }, [formFields, hasContentField, hasTitleField]);

    
    function base64ToBlob(base64Str) {
      const base64ContentArray = base64Str.split(",");
      const mimeType = base64ContentArray[0].match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0];
      const byteCharacters = atob(base64ContentArray[1]);
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
          const slice = byteCharacters.slice(offset, offset + 512);
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
      }
      return new Blob(byteArrays, {type: mimeType});
    }

    const clearData = () => {
      // 초기화 필요시 추가
    }
    // `formData`가 변경된 후 호출
    useEffect(() => {
      if (!isSubmitted && photoList.length > 0 && formData['upload']) {
        createAndSendPostData(formData); // 이미지 업로드가 완료되면 게시글 전송
        setIsSubmitted(true); // 호출 이후 상태를 true로 설정하여 다시 호출되지 않도록 함
      }
    }, [formData]); // formData가 변경될 때마다 실행

    const uploadImage = async () => {
      try {
        var formData = new FormData();
        photoList.forEach((photo, index) => {
          const { url, ...otherProps } = photo;
          const imageBlob = base64ToBlob(photo.url);
          console.log('포토속성명:' + JSON.stringify(otherProps) + `${index}-${photo.name}`);
          // 템플릿 리터럴을 사용하여 파일명 결합
          const fileName = `${index}-${photo.name}`;
          formData.append('imgs', imageBlob, fileName); 
        });
        formData.append('domain', 'crm_pinecinema');
    
        const response = await fetch('https://file.antsnest.co.kr:3400/upload/Registration', {
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
          body: formData,
        });
    
        // 응답 상태 확인
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}`);
        }
    
        // 응답 헤더가 JSON인지 확인
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          try {
            const result = await response.json();
            console.log('uploadImage 함수 결과:', result); // 결과 로그 확인
            clearData(); // 데이터 초기화
            return result; // JSON 응답을 반환
          } catch (parseError) {
            console.error('JSON 파싱 중 오류 발생:', parseError);
            return { error: 'JSON 파싱 오류', details: parseError.message };
          }
        } else {
          const textResult = await response.text(); // 텍스트로 응답 확인
          console.warn('JSON이 아닌 응답을 수신했습니다:', textResult);
          return { error: 'JSON 응답이 아닙니다', details: textResult }; // 에러 응답 반환
        }
      } catch (err) {
        console.error("이미지 업로드 중 오류 발생:", err);
        throw err;
      }
    };

    const handleInputChange = (fieldId, value) => {
      setFormData({ ...formData, [fieldId]: value });
      const field = formFields.find(f => f.column_id === fieldId);
      const field_root = formFields.find(f => f.root_column === fieldId);
    
      if (field_root && field_root.root_column === fieldId) {
          // root_column 값이 변경될 때 상태 업데이트
          setRootColumnValues({ ...rootColumnValues, [field.column_id]: value }); // 수정 구간
      }
    };

    const handleEditorChange = (content) => {
      setEditorContent(content);
    };

    const handleTitleChange = (title) => {
      setFormData({ ...formData, title });
    };

    const handleSubmit = async (event) => {
      event.preventDefault();
    
      try {
        let imageUploadResult;
        if (photoList.length > 0) {
          imageUploadResult = await uploadImage();
          // 상태 업데이트 후에 최신 formData를 사용하여 postData를 생성하고 전송
          const updatedData = {
            ...formData,
            ['upload']: imageUploadResult.src,
          };
          createAndSendPostData(updatedData); // 업데이트된 formData로 호출
        } else {
          createAndSendPostData(formData); // 이미지가 없을 때 바로 postData 생성
        }
      } catch (error) {
        console.error("Error creating post:", error);
        alert("게시글 작성 중 오류가 발생했습니다." + error);
      }
    };
    
   // 상태가 변경된 후 실행할 함수 분리
    const createAndSendPostData = async (currentFormData) => {
      //alert(JSON.stringify(currentFormData));
      try {
        const postData = {
          table: tableName,
          ...currentFormData, // 현재 formData를 사용
          content: editorContent,
        };
        console.log(JSON.stringify(postData));
        if (hasTitleField && hasContentField) {
          if (!currentFormData.title || !editorContent) {
            // if (!window.confirm('글을. 작성하시겠습니까?')) {
            //   return; // 사용자가 확인을 거부하면 중단
            // }
          }
        }
        
        const response = await fetch(`/request/postings`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        alert("게시글이 성공적으로 작성되었습니다!");
        closeForm();
        setRefrashFlag(!refrashFlag);
      } catch (error) {
        console.error("Error creating post:", error);
        alert("게시글 작성 중 오류가 발생했습니다." + error);
      }
    };
    return (
      <PostFormContainer>
        {/* {JSON.stringify(formFields)} */}
        <Form>
        {formFields
                  .sort((a, b) => {
                    const controlIdxA = a.control_idx !== null ? parseInt(a.control_idx, 10) : null;
                    const controlIdxB = b.control_idx !== null ? parseInt(b.control_idx, 10) : null;

                    if (controlIdxA === null) return 1; // a가 null이면 b보다 뒤로 이동
                    if (controlIdxB === null) return -1; // b가 null이면 a보다 앞으로 이동

                    return controlIdxA - controlIdxB; // 둘 다 null이 아니면 숫자 비교
                  })
                  .map((field, index) => (
                    <DynamicInput
                      setFormFields={setFormFields}
                      setPhotoList={setPhotoList}
                      photoList={photoList}
                      key={index}
                      field={field}
                      value={formData[field.column_id] || ""}
                      onChange={handleInputChange}
                      rootColumnValue={rootColumnValues[field.root_column]} // 수정 구간
                      setformFields={setFormFields}
                    />
                  ))}
                {menuConfig.use_upload &&
                <div style={{textAlign:'left',gridColumn:'span 4'}}>
                  <FileUploadLabel>파일 업로드</FileUploadLabel>
                <ImgInput
                  onChange={handleInputChange}
                  setImageUrl={setPhotoList}
                  setAlign={'left'}
                  setWidth={140}
                  setHeight={140}
                  /></div>}
                {menuConfig.use_editer && hasTitleField && hasContentField && <RichTextEditor
                  handleEditorChange={handleEditorChange}
                  reqPost={handleSubmit}
                  onTitleChange={handleTitleChange}
                />}

               
                

                {menuConfig.use_editer && hasTitleField && hasContentField ? (
                  <></>
                ) : (
                  <SubmitButton
                    ref={PhotoSubmit}
                    variant="green"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    등록
                  </SubmitButton>
                )}
        </Form>
      </PostFormContainer>
    );
};