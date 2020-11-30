import Server from "../utils/request";

export function
    // 上传图片
    uploadImg(data = {}) {
    return request({
        url: `/article/file/upload`,
        method: 'post',
        data // data: data 简写
    })
}
// 删除图片
export function deleteImg(imageUrl) {
    return request({
        url: `/article/file/delete`,
        method: 'delete',
        params: { 'fileUrl': imageUrl }
    })
}
