import React from 'react';

// ThumbnailViewer 컴포넌트 정의
export default function ThumbnailViewer({ images }) {
    // images 배열이 비어있지 않은지 확인
    if (!images || images.length === 0) {
        return <p>No images available.</p>;
    }

    return (
        <div style={styles.container}>
            {images.map((imageSrc, index) => (
                <div key={index} style={styles.thumbnailWrapper}>
                    <img
                        src={imageSrc}
                        alt={`Thumbnail ${index + 1}`}
                        style={styles.thumbnail}
                    />
                </div>
            ))}
        </div>
    );
}

// 간단한 스타일 객체
const styles = {
    container: {
        margin:'25px 30px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
    },
    thumbnailWrapper: {
        border: '1px solid #ddd',
        padding: '15px',
        borderRadius: '5px',
        width: '100px',
        height: '100px',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    thumbnail: {
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'cover',
    },
};