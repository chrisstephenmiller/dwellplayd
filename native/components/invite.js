import React from 'react'
import { connect } from 'react-redux'
import { StyleSheet, Text, View, ListView } from 'react-native';
import { Container, Button, Icon, ListItem, List } from 'native-base';
import t from 'tcomb-form-native'
import { sendInvitations } from '../store/community';
import customFormStyle from '../customFormStyle'

const Email = t.refinement(t.String, email => {
  const reg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/; //or any other regexp
  return reg.test(email);
});

const InviteForm = t.struct({
  email: Email,
})

const Form = t.form.Form

const options = {
  stylesheet: customFormStyle,
  fields: {
    email: {
      error: 'Insert a valid email'
    },
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: '#8C9A9E',
    alignItems: 'center',
  },
  form: {
    margin: 20,

  },

  titleText: {
    color: '#F5EE9E',
    fontWeight: 'bold',
    fontSize: 20,
  },
  button: {
    padding: 10,
    margin: 10,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#93B7BE',
  },
  text: {
    color: '#747578',
    fontSize: 20,
  }
})

class Invite extends React.Component {
  constructor(props) {
    super(props)
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      email: '',
      emailList: [],
    }
  }

  handleSubmit = () => {
    this.props.inviteSubmit(this.state.emailList, this.props.user, this.props.community.id)
  }

  addEmail = () => {
    const form = this._form.getValue()
    if (form) this.setState({emailList: [...this.state.emailList, form.email]})
    console.log(this.state.email)
  }

  deleteRow(secId, rowId, rowMap, data) {
    rowMap[`${secId}${rowId}`].props.closeRow();
    const newData = [...this.state.emailList];
    newData.splice(rowId, 1);
    this.setState({ emailList: newData });
  }

  render() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    return (
      <Container style={styles.container}>
        <View style={styles.form}>
          <Text style={styles.title}>Invite your mates</Text>
          <List
            dataSource={this.ds.cloneWithRows(this.state.emailList)}
            renderRow={data => (
              <ListItem>
                <Text> {data} </Text>
              </ListItem>
            )}
            renderRightHiddenRow={(data, secId, rowId, rowMap) =>
              (<Button full danger onPress={_ => this.deleteRow(secId, rowId, rowMap, data)}>
                <Icon active name="trash" />
              </Button>)}
            rightOpenValue={-75}
          />
          <Form
            ref={c => { this._form = c }}
            type={InviteForm}
            options={options}
          />
          <Button rounded onPress={this.addEmail} style={styles.button}>
            <Text style={styles.titleText}>Add</Text>
          </Button>
          {
            this.state.emailList.length
              ? <Button rounded onPress={this.handleSubmit} style={styles.button}>
                <Text style={styles.titleText}>Send Invites</Text>
              </Button>
              : ''
          }

        </View>
      </Container>
    )
  }
}

const mapState = ({ community, user }) => ({ community, user })

const mapDispatch = (dispatch, ownProps) => {
  return {
    inviteSubmit: (emails, user, communityId) => {
      dispatch(sendInvitations(emails, user, communityId))
      ownProps.navigation.navigate('Tasks')
    }
  }
}

export default connect(mapState, mapDispatch)(Invite)
