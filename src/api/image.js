import request from "../utils/request";
//上传图片接口
export function uploadAdvertData(file) {
    return request({
        url: "/article/file/upload",
        method: "POST",
        data: {
            file
        }
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
