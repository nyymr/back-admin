import request from '@/utils/request'



// 角色条件分页查询
export function getRoleList(query, current = 1, size = 20) {
    return request({
        url: `/system/role/search`,
        method: 'post',
        data: { ...query, current, size }
    })
}

// 新增
export function addRole(data) {
    return request({
        url: `/system/role`,
        method: 'post',
        data
    })
}

// 查询
export function getRoleDateById(id) {
    return request({
        url: `/system/role/${id}`,
        method: 'get'
    })
}

// 更新
export function updateRoleData(data) {
    return request({
        url: `/system/role`,
        method: 'put',
        data
    })
}

// 删除
export function deleteRoleById(id) {
    return request({
        url: `/system/role/${id}`,
        method: 'delete'
    })
}

// 通过角色id查询所拥有的菜单ids
export function getMenuIdsByRoleId(id) {
    return request({
        url: `/system/role/${id}/menu/ids`,
        method: 'get'
    })
}

// 保存角色所拥有的菜单ids
export function saveRoleMenu(id, menuIds) {
    return request({
        url: `/system/role/${id}/menu/save`,
        method: 'post',
        data: menuIds
    })
}

