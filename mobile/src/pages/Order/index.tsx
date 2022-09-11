import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Modal, FlatList
}
    from "react-native"
import { Feather } from '@expo/vector-icons'
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native'
import { api } from '../../services/api'
import { ModalPicker } from '../../components/ModalPicker'
import { ListItem } from '../../components/ListItem'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { StackPramList } from '../../routes/app.routes'



type RouteDetailParams = {
    order: {
        number: string | number
        order_id: string
    }
}

export type CategoryProps = {
    id: string
    name: string
}


type productprops = {
    id: string
    name: string
}

type ItemProps = {
    id: string
    product_id: string
    name: string
    amount: string | number
}



type OrderRouteProps = RouteProp<RouteDetailParams, 'order'>

export default function Order() {
    const route = useRoute<OrderRouteProps>()
    const navigation = useNavigation<NativeStackNavigationProp<StackPramList>>()

    const [category, setCategory] = useState<CategoryProps[] | []>([])
    const [categorySelectd, setCategorySelectd] = useState<CategoryProps | undefined>()

    const [product, setProduct] = useState<productprops[]>([])
    const [productSelected, setProductSelected] = useState<productprops | undefined>()
    const [modalProductVisibly, setModalProductVisibly] = useState(false)

    const [amount, setAmount] = useState('1')
    const [items, setItems] = useState<ItemProps[]>([])

    const [ModlCategoryVisibly, setModalCategoryVisibly] = useState(false)

    useEffect(() => {
        async function loadInfo() {
            const response = await api.get("/category")
            // console.log(response.data)
            setCategory(response.data)
            setCategorySelectd(response.data[0])
        }
        loadInfo()
    }, [])


    useEffect(() => {
        async function loadProduct() {

            const response = await api.get('/category/product', {
                params: {
                    category_id: categorySelectd?.id
                }
            })
            setProduct(response.data)
            setProductSelected(response.data[0])
        }
        loadProduct()

    }, [categorySelectd])


    async function handleCloseOrder() {
        try {
            await api.delete('/order', {
                params: {
                    order_id: route.params?.order_id
                }
            })
            navigation.goBack()
        } catch (err) {
            console.log(err)
        }
    }
    function handleChangeCategory(item: CategoryProps) {
        setCategorySelectd(item)
    }

    function hanldeChangeProduct(item: productprops) {
        setProductSelected(item)

    }


    //Adiconar pedido na mesa
    async function handleAdd() {
        const response = await api.post('/order/add', {
            order_id: route.params?.order_id,
            product_id: productSelected?.id,
            amount: Number(amount)
        })

        let data = {
            id: response.data.id,
            product_id: productSelected?.id as string,
            name: productSelected?.name as string,
            amount: amount
        }
        setItems(oldArray => [...oldArray, data]) // Salvando o que tem array mais o que ele tá adicionando
    }

    async function handleDeleteItem(item_id: string) {
        await api.delete("/order/remove", {
            params: {
                item_id: item_id
            }
        })

        //após remove da api removemos esse item da nossa lista de items
        let removeItem = items.filter(item => {
            return (item.id !== item_id)
        })
        setItems(removeItem)

    }

    function handleFinishOrder() {
        navigation.navigate("FinishOrder", {
            number: route.params?.number,
            order_id: route.params?.order_id
        })
    }

    return (
        <View style={styles.container} >
            <View style={styles.header}>
                <Text style={styles.title} >Mesa {route.params.number}</Text>

                {items.length === 0 && (
                    <TouchableOpacity onPress={handleCloseOrder}>
                        <Feather name="trash-2" size={28} color={"#FF3F4b"} />
                    </TouchableOpacity>
                )}
            </View>
            {category.length !== 0 && (
                <TouchableOpacity style={styles.input} onPress={() => setModalCategoryVisibly(true)} >
                    <Text style={{ color: '#FFF' }}>
                        {categorySelectd?.name}
                    </Text>
                </TouchableOpacity>
            )}

            {product.length !== 0 && (
                <TouchableOpacity style={styles.input} onPress={() => setModalProductVisibly(true)}>
                    <Text style={{ color: '#FFF' }}> {productSelected?.name}  </Text>
                </TouchableOpacity>
            )}

            <View style={styles.qtdContainer}>
                <Text style={styles.qtdText}>Quantidade</Text>
                <TextInput
                    style={[styles.input, { width: '60%', textAlign: 'center' }]}
                    placeholderTextColor={'#FFF'}
                    keyboardType='numeric'
                    value={amount}
                    onChangeText={setAmount}
                />
            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.buttonAdd} onPress={handleAdd}>
                    <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, { opacity: items.length === 0 ? 0.3 : 1 }]}
                    disabled={items.length === 0}
                    onPress={handleFinishOrder}
                >
                    <Text style={styles.buttonText}>Avançar</Text>
                </TouchableOpacity>
            </View>


            <FlatList
                showsVerticalScrollIndicator={false}
                style={{ flex: 1, marginTop: 24 }}
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ListItem data={item} deleteItem={handleDeleteItem} />}
            />

            <Modal
                transparent={true}
                visible={ModlCategoryVisibly}
                animationType={'fade'}
            >
                <ModalPicker
                    handleCloseModal={() => setModalCategoryVisibly(false)}
                    options={category}
                    selectedItem={handleChangeCategory}
                />
            </Modal>


            <Modal
                transparent={true}
                visible={modalProductVisibly}
                animationType={'fade'}
            >
                <ModalPicker
                    handleCloseModal={() => setModalProductVisibly(false)}
                    options={product}
                    selectedItem={hanldeChangeProduct}
                />

            </Modal>
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1d1d2e',
        paddingVertical: '5%',
        paddingEnd: '4%',
        paddingStart: '4%'
    },
    header: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'center',
        marginTop: 24
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
        marginRight: 14
    },
    input: {
        backgroundColor: '#101026',
        borderRadius: 4,
        width: '100%',
        height: 40,
        marginBottom: 12,
        justifyContent: 'center',
        paddingHorizontal: 8,
        color: 'white',
        fontSize: 20
    },
    qtdContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    qtdText: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold'
    },
    actions: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between'
    },
    buttonAdd: {
        width: '20%',
        backgroundColor: '#3fd1ff',
        borderRadius: 4,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: '#101026',
        fontSize: 18,
        fontWeight: 'bold'

    },
    button: {
        backgroundColor: '#3fffa3',
        borderRadius: 4,
        height: 40,
        width: '75%',
        justifyContent: 'center',
        alignItems: 'center'
    }
})