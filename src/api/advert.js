import Server from "../utils/request";


//分页数据接口
export function getAdvertList(searchMap, current, size) {
    return Server({
        url: "/article/advert/search",
        method: "POST",
        data: {
            ...searchMap,
            current,
            size
        }
    })
}

//新增广告接口
export function addAdvert(data) {
    return Server({
        url: " /article/advert",
        method: "POST",
        data,
    })
}

//获取单条广告数据接口
export function getOneAdvertData(id) {
    return Server({
        url: `/article/advert/${id}`,
        method: "GET"
    })
}
//修改广告接口
export function updateAdvert(data) {
    return Server({
        url: `/article/advert`,
        method: 'PUT', 
        data,
    })
}

//删除广告接口
export function delAdvert(id) {
    return Server({
        url: `/article/advert/${id}`,
        method: 'DELETE', 
    })
}

// export function Advert() {
//     return Server({
//         url: "",
//         method: ""
//     })
// }