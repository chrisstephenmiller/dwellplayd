import React, { Component } from 'react';
import { StyleSheet, Text, ListView, View } from 'react-native';
import { SelectTaskItem } from '../components'
import Modal from 'react-native-modal'
import {
  Container,
  Content,
  Icon,
  List,
  Item,
  Input,
  Button,
} from 'native-base';
import store, {
  playThunkerator,
  submitCommunityTaskFrequenciesThunkerator,
  getSuggestedTasksFromServerThunkerator,
  addCustomCommunityTaskThunkerator,
  deleteCommunityTaskThunkerator,
  setToNotNewUser,
} from '../store'
import { connect } from 'react-redux';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8C9A9E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#D4F5F5',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: '#8C9A9E',
  },
  button: {
    flex: 1,
    backgroundColor: '#93B7BE',
    padding: 12,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#8C9A9E',
  },
  list: {
    backgroundColor: '#8C9A9E',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#fff'
  },
  left: {
    height: 50,
    display: 'flex',
    justifyContent: 'space-between'
  },
  score: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  text: {
    color: '#D4F5F5',
    fontSize: 16,
  },
  textSlide: {
    color: '#8C9A9E'
  },
  input: {
    borderColor: '#D4F5F5'
  },
  card: {
    backgroundColor: '#fff',
    margin: 0,
  }
});

class SelectTasks extends Component {
  constructor(props) {
    super(props)
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      taskInput: '',
      activeTask: {},
    }
  }

  _renderButton = (text, onPress) => (
    <View>
      <Button rounded onPress={onPress} style={styles.button} >
        <Text style={{ color: '#D4F5F5' }}>{text}</Text>
      </Button>
    </View>
  );

  _renderModalContent = () => (
    <View style={styles.modalContent}>
      <Text>Each of these cards is a task.  We've added some popular ones for you.  Feel free to use them or delete by swiping left.</Text>
      <Text>Go ahead and select how often you think each task should be done by using the slider.</Text>
      <Text>When you're ready, activate the task!</Text>
      {this._renderButton('All Set', () => store.dispatch(setToNotNewUser()))}
    </View>
  );

  componentDidMount() {
    if (!this.props.communityTasks.length) {
      store.dispatch(getSuggestedTasksFromServerThunkerator(this.props.community.id))
    }
  }

  componentWillUnmount() {
    store.dispatch(submitCommunityTaskFrequenciesThunkerator(this.props.community.id, this.props.communityTasks))
  }

  handleChangeTask = (taskInput) => {
    this.setState({ taskInput })
  }

  handleAddTask = () => {
    const newTask = {
      name: this.state.taskInput,
    }
    this.setState({ taskInput: '', inActiveTasks: true })
    store.dispatch(addCustomCommunityTaskThunkerator(newTask, this.props.community.id))
  }

  deleteRow(secId, rowId, rowMap, data) {
    rowMap[`${secId}${rowId}`].props.closeRow();
    store.dispatch(deleteCommunityTaskThunkerator(this.props.communityTasks[rowId]))
  }

  activateTask = async (task) => {
    console.log(task)
    await store.dispatch(submitCommunityTaskFrequenciesThunkerator(this.props.community.id, this.props.communityTasks))
    await store.dispatch(playThunkerator(task))
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Add / Edit Tasks'
    }
  }

  render() {
    const communityTasks =
      this.props.communityTasks.sort((a, b) => {
        var dateA = a.task.createdAt
        var dateB = b.task.createdAt
        if (dateA < dateB) return 1
        if (dateA > dateB) return -1
        return 0
      })

    return (
      <Container style={styles.list}>
        <Content contentContainerStyle={{ backgroundColor: '#8C9A9E' }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
          <Item
            rounded
            style={{
              flex: 4,
              marginLeft: 10,
              paddingLeft: 10,
              borderColor: '#D4F5F5'
            }}>
            <Input
              onChangeText={this.handleChangeTask}
              onSubmitEditing={this.handleAddTask}
              placeholder="Enter a custom task"
              value={this.state.taskInput}
              style={styles.text}
            />
          </Item>
          <Button rounded style={styles.button} onPress={this.handleAddTask} ><Text style={{ fontSize: 15, fontWeight: 'bold', color: '#747578' }}>
                    Add
                  </Text></Button>
          </View>
          <List
            dataSource={this.ds.cloneWithRows(communityTasks)}
            renderRow={comTask => {
              const inactive = !this.props.taskItems.some(task => task.taskId === comTask.task.id && !task.completed)
              return (
                <View style={{ backgroundColor: '#8C9A9E' }}>
                  <SelectTaskItem
                    change={this.change}
                    activateTask={this.activateTask}
                    inactive={inactive}
                    styles={styles}
                    comTask={comTask}
                    key={comTask.id} />
                </View>
              )
            }}
            renderRightHiddenRow={(data, secId, rowId, rowMap) =>
              (<Button full danger onPress={_ => this.deleteRow(secId, rowId, rowMap, data)}>
                <Icon active name="trash" />
              </Button>)}
            rightOpenValue={-75}
          />

        </Content>
        <Modal
          isVisible={this.props.isNewUser}
          animationInTiming={2000}
          animationOutTiming={2000}
          backdropTransitionInTiming={2000}
          backdropTransitionOutTiming={2000}
        >
          {this._renderModalContent()}
        </Modal>
      </Container>

    );
  }
}


const mapState = ({ isNewUser, communityTasks, suggestedTasks, community, taskItems }) => ({ isNewUser, communityTasks, suggestedTasks, community, taskItems })

const mapDispatch = null

export default connect(mapState, mapDispatch)(SelectTasks)
