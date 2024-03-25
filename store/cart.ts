import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { formatMonetaire } from '@/utils/index'
import { locally } from '@/utils/locally'

//import Swal from 'sweetalert2'
//import { apiRest } from '@/server/api'



export const useCartStore = defineStore('cart', () => {
  const cart = ref<Array<ItemProduct>>([])

  function $reset() {
    cart.value = []
  }

  // GETTER
  const getQuantity = computed(() => (id: number) => filterIdProduct(id).quantity)
  const getPrice = computed(() => (id: number) => formatMonetaire(totalProduct(id)))
  const getTotal = computed(() => formatMonetaire(totalAll()))
  const getLength = computed(() => cart.value.length)

  //my local function
  function filterIdProduct<ItemProduct>(id: number){
    const myProduct = cart.value.filter((i) => i !== null && i !== undefined ).filter(i => i.id === id)[0]
    if (myProduct) {
      return myProduct
    } else {
      throw new Error('Produit non trouvé')
    }
  }

  function totalProduct(id: number){
    return filterIdProduct(id).quantity * filterIdProduct(id).price
  }
  function totalAll(){
    let total = 0
    for(const item of cart.value) {
      total += totalProduct(item.id)
    }
    return total
  }

  function setLocalStorageCart(){
    cleanCart()
    locally.setItem('cart', JSON.stringify(cart))
  }

  function cleanCart(){
  
    // Remouv [null, undefined] value :
    cart.value = cart.value.filter((i) => i !== null && i !== undefined )
    
    // Pass a function to map
    let tableauUnique: Array<number> = []

    // the doublon case
    let isDoublonId = cart.value.map((x) => {
      if ( tableauUnique.includes(x.id) ) {
        return true;
      } else {
        tableauUnique.push(x.id);
        return false;
      }
    })

    let ids: Array<number> = []
    for ( const i in cart.value ){

      if (isDoublonId[i]){
        // The id of first value:
        // id = cart.value.findIndex(e => e.id === cart.value[i].id)
        cart.value[cart.value.findIndex(e => e.id === cart.value[i].id)].quantity += cart.value[i].quantity 
        ids.push(cart.value[i].id) // case of doublon is false
        // I can use 'null' value in cart.value but 'findIndex' don't love this
      }
    }
    cart.value = cart.value.filter((index) => ids.includes(index.id))

  }
  // Chang Type : add quantity in item
  function createItemProduct(dataProduct: DataProduct, quantity: number): ItemProduct {
    return {
      ...dataProduct,
      quantity,
    };
  }

  //ACTION function 
  function initCart(){
    const local = locally.getItem('cart')

    if(local) {
      if (JSON.parse(local)._value.length > 0) {
        for (const item of JSON.parse(local)._value){
          cart.value.push(item)
        }
      } else setLocalStorageCart()
    } else setLocalStorageCart()
  }



  function addItem(item: DataProduct | ItemProduct) {

    // itemInCart is a array
    // the first element itemInCart[0] is a proxy
    cleanCart()
  
    const myProduct = cart.value.filter((i) => i.id === item.id)[0]
    if (myProduct) {
      myProduct.quantity ++
    } else {
      cart.value.push(createItemProduct(item, 1))
    }
    setLocalStorageCart()
  }

  function subtractItem(item: DataProduct) {

    cleanCart()

    const itemInCart = cart.value.filter(i => i.id === item.id)[0]

    if( itemInCart ) {
      itemInCart.quantity --
      /*if (itemInCart.quantity === 0){
        Swal.fire({
          title: "Are you sure?",
          text: "Remouve your product?",
          icon: "warning",
          imageUrl: itemInCart.get_thumbnail,
          imageHeight: 200,
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "Deleted!",
              text: "Your cart is clean",
              icon: "success"
            })
          cart.value = cart.value.filter((i) => i.quantity !== 0)
          } else {
            itemInCart.quantity = 1
          }
        })
      }*/
    }
    setLocalStorageCart()
  }
  

  return {
    Authenticated,
    cart,
    addItem,
    subtractItem,
    initCart,
    getQuantity,
    getPrice,
    getTotal,
    getLength,
  }
})