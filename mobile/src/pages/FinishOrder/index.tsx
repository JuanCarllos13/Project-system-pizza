import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from '@expo/vector-icons'
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native'
import {api} from '../../services/api'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {StackPramList} from '../../routes/app.routes'

type RouteDetailParams ={
    FinishOrder:{
        number: string | number
        order_id : string
    }
}

type FinishOrderRouteProp = RouteProp<RouteDetailParams, 'FinishOrder'>

export function FinishOrder() {
    const route = useRoute<FinishOrderRouteProp>()
    const navigation = useNavigation<NativeStackNavigationProp<StackPramList>>()

    async function handleFinish(){
       try{
        await api.put("/order/send", {
            order_id: route.params.order_id
        })

        navigation.popToTop()
       }catch(err){
        console.log("ERRO AO FINALIZAR, tente mais tarde")
       }
    }
    
    return (
        <View style={styles.container} >
            <Text style={styles.alert}>Você deseja finalizar esse pedido?</Text>
            <Text style={styles.titile}> Mesa {route.params?.number}</Text>

            <TouchableOpacity style={styles.button} onPress={handleFinish}>
                <Text style={styles.Textbutton}>Finalizar pedido</Text>
                <Feather name="shopping-cart" size={20} color={"#1d1d2e"} />
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1d1d2e",
        paddingVertical: "5%",
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: "4%"
    },
    alert: {
        fontSize: 20,
        color: "#FFF",
        fontWeight: 'bold',
        marginBottom: 12
    },
    titile: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 12
    },
    Textbutton: {
        fontSize: 18,
        marginRight: 8,
        fontWeight: 'bold',
        color: "#1d1d2e"

    },
    button: {
        backgroundColor: '#3fffa3',
        flexDirection: 'row',
        width: "65%",
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4
    }
})
