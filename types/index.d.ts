type DataProduct = {
    //api original data
    id: number

    name: string
    get_absolute_url: string
    description: string
    price: number

    get_image: string
    get_thumbnail: string
}

type ItemProduct = DataProduct & {
    quantity: number
}
