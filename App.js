import React, { useState, useEffect } from "react";
import { Button, Image, Text, SafeAreaView, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

export default function ImagePickerExample() {
  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  const [foto, setFoto] = useState();

  useEffect(() => {
    async function verificaPermissoes() {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      requestPermission(cameraStatus === "granted");
    }

    verificaPermissoes();
  }, []);

  const acessarCamera = async () => {
    const imagem = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });
    console.log(imagem);
    setFoto(imagem.assets[0].uri);
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button title="Acessar câmera" onPress={acessarCamera} />
      {foto && (
        <Image source={{ uri: foto }} style={{ width: 300, height: 200 }} />
      )}
    </View>
  );

  function App() {
    /* State para a geolocalização */
    const [minhaLocalizacao, setMinhaLocalizacao] = useState(null);

    const [status, requestPermission] = Location.useForegroundPermissions();

    useEffect(() => {
      async function verificaPermissoes() {
        const { locationStatus } =
          await Location.requestForegroundPermissionsAsync();
        requestPermission(locationStatus === "granted");

        let localizacaoAtual = await Location.getCurrentPositionAsync({});
        console.log("Status: " + status.status);
        setMinhaLocalizacao(localizacaoAtual);
      }

      verificaPermissoes();
    }, []);

    console.log(minhaLocalizacao);

    const regiaoInicial = {
      // Estado de SP
      latitude: -23.533773,
      longitude: -46.65529,
      latitudeDelta: 10,
      longitudeDelta: 10,
    };

    /* Usando state para controlar a localização */
    const [localizacao, setLocalizacao] = useState();

    const marcarLocal = (event) => {
      setLocalizacao({
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
        latitude: minhaLocalizacao.coords.latitude,
        longitude: minhaLocalizacao.coords.longitude,
      });
    };

    return (
      <>
        <StatusBar />
        <View style={estilos.container}>
          <View style={estilos.viewBotao}>
            <Button title="Onde estou?" onPress={marcarLocal} />
          </View>
          <View style={estilos.viewMapa}>
            <MapView
              style={estilos.mapa}
              region={localizacao ?? regiaoInicial}
              liteMode={false}
              mapType="standard"
            >
              {localizacao && (
                <Marker
                  coordinate={localizacao}
                  title="Aqui!!!"
                  onPress={(e) => console.log(e.nativeEvent)}
                />
              )}
            </MapView>
          </View>
        </View>
      </>
    );
  }
}
