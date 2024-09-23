export const permissionRoute: any = {
  paths: {
    '/api/v1/user-community/profile/:id': {
      'post': ['cultureCheck', 'brandCultureStrategy'],
      'get': ['cultureCheck' ]
    },
    '/api/v1/user/increaseProfileCount/:id': {
      'post': ['learning', 'courses'],
      'get': ['learning']
    },
    '/api/v1/possescards/':{
      'get': [
        'possessCard'
       ]
    }
  }
} 