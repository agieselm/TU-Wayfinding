import React, { Component } from 'react';
import { View,ScrollView, KeyboardAvoidingView,TouchableWithoutFeedback,Keyboard, Text,StyleSheet,FlatList,Dimensions, TouchableOpacity } from 'react-native';
import { MapView,Permissions,Location  } from 'expo';
import { Container, Header, Right, Body, Left, Button, Icon, } from 'native-base';
import { SearchBar } from 'react-native-elements';
import SearchInput, { createFilter } from 'react-native-search-filter';


//Get height and width of screen
var {height, width} = Dimensions.get('window');

//Get name of key for list of data
const keys = ['key'];

//Random list of classes for prototype
var classList = [{key: 'Principles of Computer Science II'}, {key: 'Low-Level Computing'}, {key: 'Discrete Structures'}, {key: 'Principles of Data Abstraction'}, {key: 'Principles of Functional Languages'}, {key: 'Principles of Algorithms'}, {key: 'Principles of Computer Design'}, {key: 'Software Engineering'}, {key: 'Operating Systems'}, {key: 'Web Application Design'}, {key: 'Senior Software Project'}, {key: 'Calculus III'}, {key: 'Engineering Analysis and Design II'}, {key: 'Graphics'}];

//List of classes that have been filtered by current search criteria
var filteredTerms =[] ;	

class MapScreen extends Component {

    static navigationOptions = {
        drawerIcon: ({ tintColor }) => (
            <Icon name="home" style={{ fontSize: 24, color: tintColor }} />
        )
    }

    //Constructor to start search term as empty string
    constructor(props) {
        super(props);
        this.state = {searchTerm: '', followsUserLocation: false };
    }

    //updates searchTerm to the current search criteria
    searchUpdated(term){
	this.setState({searchTerm: term})
    }

    
      componentWillMount() {
          this._getLocationAsync();
        
      }
    
    
      async _getLocationAsync() {
        const {status} = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
          this.setState({
            errorMessage: 'Permission to access location was denied',
          });
        }
        Location.watchPositionAsync({enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});
      }
      


   render() {

	//creates a filter to filter through classes
  	const filteredTerms = classList.filter(createFilter(this.state.searchTerm, keys)) 
        return (
            <Container>
                <Header androidStatusBarColor={"#723130"} style={{backgroundColor: "#723130"}}>
                    <Left>
                        <Button transparent>
                            <Icon name="menu" onPress={() =>
                                this.props.navigation.openDrawer()} />
                        </Button>
                    </Left>
                    <Body />
                    <Right />
                </Header>

		{/*ScrollView used to dismiss keyboard when tapping outside of text box or keyboard*/}
                <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps='handled'>
        <MapView 
                    
                    style={{ flex: 1 }}
                    initialRegion={{
                        latitude: 29.461144,
                        longitude: -98.483166,
                        latitudeDelta: 0.0102,
                        longitudeDelta: 0.0086
                    }}
                    showsUserLocation={true}
                    followsUserLocation={this.state.followsUserLocation}
                    sshowsMyLocationButton={true}
                    provider="google"

                    

                />

           <MapView.Overlay>  
        <Button  style={{alignItems: 'center', justifyContent: 'center', alignSelf: 'center'}}
         onPress={ () => {this.setState({followsUserLocation: !this.state.followsUserLocation})}}>
            
          <Text>press</Text>
        </Button>
        </MapView.Overlay>   
		</ScrollView>

    {/*View encasing SearchBar*/}
    <KeyboardAvoidingView  behavior="height" enabled>
		
                <SearchBar
                    style={styles.searchBar}
                    containerStyle={{ backgroundColor: 'white' }}
                    inputStyle={{ backgroundColor: 'white' }}
                    ref={search => this.search = search}
                    clearIcon={{ color: 'red' }}
                    searchIcon={false} // You could have passed `null` too
                    onChangeText={(term) => {this.searchUpdated(term)}}
                    onClear={() => this.search.clear()}
                    placeholder='Type Here...'
		    onSubmitEditing={Keyboard.dismiss}
                >
			</SearchBar>
                </KeyboardAvoidingView>
		
	{/*Circular buttons under search bar*/}
	<KeyboardAvoidingView style={styles.buttons} 
			flexDirection={'row'} 
			justifyContent = {'space-evenly'} 
			alignItems={'center'}  
			behavior="padding" 
			enabled >
                                <TouchableOpacity
                                        style={styles.circle}
                            onPress={Keyboard.dismiss}
                            >
                                    <Text style= {styles.buttonText}>{"Events"}</Text>
                                </TouchableOpacity>
			<TouchableOpacity
                                        style={styles.circle}
                            onPress={Keyboard.dismiss}
                            >
                                    <Text style= {styles.buttonText}>{"Classes"}</Text>
                                </TouchableOpacity>
			<TouchableOpacity
                                        style={styles.circle}
                            onPress={Keyboard.dismiss}
                            >
                                    <Text style= {styles.buttonText}>{"Buildings"}</Text>
                                </TouchableOpacity>
			<TouchableOpacity
                                        style={styles.circle}
                            onPress={Keyboard.dismiss}
                            >
                                    <Text style= {styles.buttonText}>{"Offices"}</Text>
                                </TouchableOpacity>
                </KeyboardAvoidingView>

		{/*Adds extra spacing below buttons to appear more comfortable*/}
		<KeyboardAvoidingView style={{flex:0.01}} behavior="position"/>

		{/*Flatlist of classList, filters when you begin typing*/}
		<KeyboardAvoidingView style = {{flex:1}} behavior="padding">
		    <FlatList data= {filteredTerms} renderItem = {({item}) => 
			<TouchableOpacity style= {styles.buttonList}
			    onPress={() =>Keyboard.dismiss}>
        		    <Text style= {styles.listText}>{item.key}</Text>	
			</TouchableOpacity>
			}
		    />
		</KeyboardAvoidingView>
            </Container>
        );
    }
}

export default MapScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
      buttonText:{
        textAlign:'center',
        color: 'white',
        fontSize:width/30,
        zIndex: 10,
      },
      buttonList:{
	borderWidth: 1,
	padding: 10,
	borderColor: 'black'
      },
      listText:{
        textAlign:'left',
        color: 'black',
        fontSize:width/30,
        zIndex: 10,
      },
    circle: {
        width: width/5,
        height: width/5,
        borderRadius:width/10 ,
        backgroundColor: 'maroon',
        justifyContent:'center',
        zIndex: 10,
    },
    searchBar: {
        position: 'absolute',
    },
    separator:{
	height: 0.5,
   	 width: "80%",
    	alignSelf: 'center',
    	backgroundColor: "#555"
    },
    buttons:{
	paddingVertical: 10,
    }
})
