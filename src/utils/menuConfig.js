import { getRoutes } from '../api/route'
// let menuList = [
//   {
//     authName: '首页',
//     path: '/welcome',
//     isPublic: true
//   },
//   {
//     authName: '用户',
//     path: '/users',
//     children: [
//       {
//         authName: '用户列表',
//         path: '/user-list'
//       }
//     ]
//   },
//   {
//     authName: '角色',
//     path: '/roles',
//     children: [
//       {
//         authName: '角色列表',
//         path: '/role-list'
//       }
//     ]
//   },
//   {
//     authName: '路由',
//     path: '/route',
//     isPublic: true
//   }
// ]

function menuList() {
  return new Promise((resolve, reject) => {
    getRoutes().then(res => {
      if (res.status === 1) {
        resolve(res.data)
      } else {
        if (res.status === 2) {
          window.location.href = 'http://localhost:8080/#/login'
        }
      }
    })
  })
}

export default menuList
