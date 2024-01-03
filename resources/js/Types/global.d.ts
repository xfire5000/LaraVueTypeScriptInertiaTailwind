interface IDrawerItem {
  title: string
  link: string
  icon: string
  can: boolean
}

export {}
declare global {
  declare type IRoleItem = {
    name: string
    title: string
    id?: number
  }

  declare type IUserItem = {
    id?: number
    name: string
    email: string
    password?: string
    email_verified_at?: Date
    roles?: IRoleItem[] | string[]
    profile_photo_url?: string
    profile_photo_path?: string
    created_at?: Date
    updated_at?: Date
  }

  declare type IMenuItem = IDrawerItem & {
    child?: IDrawerItem[]
  }

  declare type IBreadCrumbItem = {
    title: string
    link?: string
    icon?: string
  }
}
