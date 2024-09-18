import os

def generate_file_list(root_dir):
    file_list = []
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith('.py'):  # Python 파일만 포함하려면 이 조건 추가
                file_list.append(os.path.join(root, file))
    return file_list

def merge_files(file_list, output_file):
    with open(output_file, 'w', encoding='utf-8') as outfile:
        for file in file_list:
            with open(file, 'r', encoding='utf-8') as infile:
                outfile.write(f"File: {file}\n")
                outfile.write(infile.read())
                outfile.write("\n\n")

if __name__ == "__main__":
    root_directory = "src"  # src 디렉토리 경로
    output_file = "merged_code.txt"  # 출력 파일 이름
    files = generate_file_list(root_directory)
    merge_files(files, output_file)
    print(f"All files in 'src' have been merged into {output_file}")