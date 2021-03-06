import React from 'react';
import { connect } from 'react-redux'
import { StyleSheet, RefreshControl, ScrollView, View, Dimensions } from 'react-native';
import { Container, Content, ActionSheet, Text, Button } from 'native-base'
import { TaskCard } from '../components'
import store, { fetchCommunityTaskItems, completeTaskItem, fetchUserScores } from '../store'
import Modal from 'react-native-modal'

const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width

const BUTTONS = [
  'provide proof',
  'cancel'
];
const CANCEL_INDEX = 1;

class TaskList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };
  }

  componentDidMount = () => {
    const { getCurrentScores, user } = this.props
    const month = new Date().getMonth()
    getCurrentScores(user.communityId, month)
  }

  static navigationOptions = {
    title: 'Current'
  }

  handleClick = clickedTask => {
    const { user, completeTask, navigation } = this.props
    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        title: clickedTask.task.name
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          clickedTask.userId = user.id
          navigation.navigate('Camera', {
            direction: 'back',
            action: 'proof',
            task: clickedTask,
          })
        }
      }
    )
  }
  refresh = () => {
    const { getTaskItems, user } = this.props
    getTaskItems(user.communityId)
    this.setState({ refreshing: false })
  }

  _renderNoTasks = () => (
      <View style={{height: '100%', backgroundColor: '#8C9A9E', justifyContent: 'center', alignItems: 'center'}}>
      <View style={{backgroundColor: '#8C9A9E', padding: 20, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: '#D4F5F5', fontWeight: 'bold'}}>Oh no! You do not have any tasks to complete</Text>
        {this._renderButton('Add Tasks', () => this.props.navigation.navigate('SelectTasks'))}
        </View>
      </View>
  )

  _renderButton = (text, onPress) => (
    <View>
      <Button rounded onPress={onPress} style={styles.button} >
        <Text style={{ paddingLeft: 10, paddingRight: 10, color: '#D4F5F5' }}>{text}</Text>
      </Button>
    </View>
  )

  render() {
    const { taskItems } = this.props
    const filteredTaskItems = taskItems && taskItems.filter(taskItem => !taskItem.completed)
    const sortedTaskItems = filteredTaskItems && filteredTaskItems.sort((a, b) => b.points - a.points)

    return (
      <Container style={styles.list}>
      <Text style={styles.title}>current tasks</Text>
      {
        sortedTaskItems.length
          ? <View style={styles.list}>
          <ScrollView refreshControl={<RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this.refresh} />}>
          <Content contentContainerStyle={styles.content}>
            {sortedTaskItems.length && sortedTaskItems.map(taskItem => {
              return (
                <TaskCard style={styles.card} key={taskItem.id} taskItem={taskItem} handleClick={this.handleClick} />
              )
            })}
          </Content>
        </ScrollView>
        </View>
        : this._renderNoTasks()
      }
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: '#8C9A9E',
    height: deviceHeight
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  content: {
    margin: 5,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 5,
    textAlign: 'center',
    color: '#D4F5F5',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#747578'
  },
  button: {
    height: 45,
    alignSelf: 'flex-end',
    backgroundColor: '#93B7BE',
    padding: 5,
    margin: 5,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#8C9A9E',
  }
});


//Render task items that are not completed
const mapState =
  ({user, community, communityTasks, taskItems}) =>
  ({user, community, communityTasks, taskItems})

const mapDispatch = dispatch => {
  return {
    getTaskItems: communityId => {
      dispatch(fetchCommunityTaskItems(communityId))
    },
    completeTask: taskItem => {
      dispatch(completeTaskItem(taskItem))
    },
    getCurrentScores: (communityId, month) => {
      dispatch(fetchUserScores(communityId, month))
    }
  }
}

export default connect(mapState, mapDispatch)(TaskList)
