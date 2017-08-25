import React from 'react';
import { StyleSheet, Text, TextInput, Button, View, FlatList, Switch, ToastAndroid } from 'react-native';
import Modal from 'react-native-modal';
import CheckBox from 'react-native-checkbox';

import axios from 'axios';

export default class App extends React.Component {
  constructor(props, ctx) {
    super(props, ctx);
    
    this.handlePress = this.handlePress.bind(this);
    this.registerPress = this.registerPress.bind(this);
    this.loginPress = this.loginPress.bind(this);
      
    this.state = {
        isModalVisible: false,
        isLoginModalVisible: true,
        titleValue: '',
        descValue: '',
        loginUser: '',
        loginPass: '',
         todoItems: [
          {
              key: 1,
              title: 'Sample Title',
              description: 'sample description',
              date: new Date(),

          }
      ],
      
    };
  }


  showModal = () => this.setState({ isModalVisible: true })
  hideModal = () => this.setState({ isModalVisible: false })
  loginModal = () => this.setState({ isLoginModalVisible: true })
  hideLoginModal = () => this.setState({ isLoginModalVisible: false })
  componentWillMount(){
      axios.get('')
  }
    
  handlePress() {
    const todoItems = this.state.todoItems.concat();
    const lastKey = todoItems[todoItems.length - 1].key;
    this.setState({ isModalVisible: false })
    this.setState({
      todoItems: todoItems.concat([{
        key: lastKey + 1,
        title: this.state.titleValue,
        description: this.state.descValue
      }]),
      titleValue: '',
      descValue: ''
    });
  }

  loginPress() {
    currentUsername = this.state.loginUser;
    currentPassword = this.state.loginPass;
    if(currentUsername !== '' && currentPassword !== ''){
        this.fetchUsers();
        for(var counter = 0; counter < this.state.todoItems.length; counter++){
            var value = this.state.todoItems[counter];
            if(currentUsername === value.username && currentPassword === value.password){
                ToastAndroid.show('Logging in...', ToastAndroid.SHORT);
                this.setState({
                    loginUser: currentUsername,
                    isLoginModalVisible: false,
                })
            }
            else{
                this.setState({
                    loginUser: '',
                    loginPass: ''
                })
                ToastAndroid.show('No such user exists.', ToastAndroid.SHORT);
            }
        }
    }
   
  }
    fetchUsers() {
        return axios.get('http://192.168.22.7:3009/admin/users')
            .then(response => {
                const todos = response.data;
                //console.log(todos);
                this.setState({
                todoItems: todos.map(function (todo) {
                    return {
                        id: todo.id,
                        password: todo.password,
                        username: todo.username,
                    };
                })
                });
            })
            .catch(err => {
                this.setState({ refreshing: false });
                ToastAndroid.show(err.toString(), ToastAndroid.SHORT);
            });
    }

  registerPress() {
   
    axios.post('http://192.168.22.7:3009/admin/users', {
        username: this.state.loginUser,
        password: this.state.loginPass
    })
   .then(response => {
        ToastAndroid.show(response.data.message, ToastAndroid.SHORT);

        this.setState({
          loginUser: '',
          isModalVisible: false,
          loginPass: ''
        })
      })
      .catch(err => ToastAndroid.show(err.response.data.error, ToastAndroid.LONG))
      console.log(this.state.loginUser);
  }
/*
<Button 
                    style={styles.buttonStyle}
                    onPress={this.showModal}
                    title="Register"
                    color="#7414c9"
                />
                <Modal isVisible={this.state.isModalVisible}
                    transparent = {false}
                    style = {{backgroundColor: '#ffffff'}}>
                    <Text style={styles.main_title}>{'\n\n Register '}</Text>
                     <TextInput
                    style={styles.textfield}
                    onChangeText={(text) => this.setState({loginUser: text})}
                    value={this.state.loginUser}
                    placeholder={'Username'}
                />
                 <TextInput
                    style={styles.textfield}
                    password={true}
                    onChangeText={(text) => this.setState({loginPass: text})}
                    value={this.state.loginPass}
                    placeholder={'Password'}
                />
                 <Text>{'\n'}</Text>
                 <Button 
                    style={styles.buttonStyle}
                    onPress={this.registerPress}
                    title="Register"
                    color="#1459c9"
                />
                <Text>{'\n'}</Text>
                    <Button
                        onPress={this.hideModal}
                        title="close"
                    />
                </Modal>
                */
  render() {
    return (
        
        
     <View style={styles.container}>
         <Modal isVisible={this.state.isLoginModalVisible}
                    transparent = {false}
                    style = {{backgroundColor: '#ffffff'}}>
        <View style={{flex: 1}}>
                <Text style={styles.main_title}>{'\n\n Welcome '}</Text>
                <TextInput
                    style={styles.textfield}
                    onChangeText={(text) => this.setState({loginUser: text})}
                    value={this.state.loginUser}
                    placeholder={'Username'}
                />
                 <TextInput
                    style={styles.textfield}
                    password={true}
                    onChangeText={(text) => this.setState({loginPass: text})}
                    value={this.state.loginPass}
                    placeholder={'Password'}
                />
                 <Text>{'\n'}</Text>
                <Button 
                    style={styles.buttonStyle}
                    onPress={this.loginPress}
                    title="Login"
                    color="#1459c9"
                />
                <Text>{'\n'}</Text>
                
            </View>
        </Modal> 
           <Button
            onPress={this.showModal}
            title="Add Task"
            color="#841584"
            accessibilityLabel="Add Task"
        />
       
        <Modal isVisible={this.state.isModalVisible}
        transparent = {false}
        style = {{backgroundColor: '#ffffff'}}>
            <View style={{ flex: 1 }}>
                 <Text style={styles.main_title} >To-Do List</Text>
        <TextInput
            style={styles.textfield}
            onChangeText={(text) => this.setState({ titleValue: text })}
            value={this.state.titleValue}
            placeholder={'Title'}
          />
        <TextInput
          style={styles.textfield}
          onChangeText={(text) => this.setState({ descValue: text })}
          value = {this.state.descValue}
          placeholder={'Description'}
        />
        <Button
          style={styles.buttonStyle}
          onPress={this.handlePress}
          title="Add"
          color="#000"
        />
       
            </View>
            <Button
                title="close"
                onPress={this.hideModal}
            />
        </Modal>
        <FlatList
            data={this.state.todoItems}
            renderItem={({item}) => 
                       <TodoItem title={item.title} description={item.description} />
                       }
          />
      </View>
  );
  }
}

class TodoItem extends React.Component {
    constructor({title, description}) {
        super();
        
        this.state = {
            title: title,
            description: description,
            checked: false
            
        }
    }
    
    render() {
        var item = this.state;
        var style = item.checked ? "line-through" : "none";
        var currentDate = new Date();
        
        return(
            <View style={{flexDirection: 'row'}}>
                <Switch style={{width: 50}} value={item.checked} onValueChange={(value) => {this.setState({checked: value})}} /> 
                <Text style={{width: 100}} style={{textDecorationLine: style}}>{item.title + ' : '+  item.description + " : " +
                    currentDate.toLocaleDateString() + " : " + currentDate.toLocaleTimeString() + ' : ' + App.state.loginUser} </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 50,
  },
  main_title: {
      fontSize: 20,
      marginBottom: 10,
      textAlign: 'center',
  },
  textfield: {
      width: 300, 
      fontSize: 15,
      textAlign: 'center',
      padding: 10,
  },
  buttonStyle: {
      width: "100%", 
      fontSize: 20,
      padding: 10,
  },
  title: {
      fontSize: 18,
  },
  desc: {
      fontSize: 13,
  },
  strike: {
      textDecorationLine: 'line-through'
  }
});
