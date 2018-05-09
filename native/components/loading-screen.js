import React from 'react'
import { StyleSheet } from 'react-native';
import { Container } from 'native-base';
import { connect } from 'react-redux'
import store, { fetchCommunity, getAllCommunityTasksFromServerThunkerator, fetchCommunityTaskItems } from '../store'

class Play extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount = async () => {
    if (this.props.user.communityId) {
      await store.dispatch(fetchCommunity(this.props.user.communityId))
      await store.dispatch(getAllCommunityTasksFromServerThunkerator(this.props.user.communityId))
      await store.dispatch(fetchCommunityTaskItems(this.props.user.communityId))
      if (this.props.taskItems.length) this.props.navigation.navigate('Tasks')
      else this.props.navigation.navigate('SelectTasks')
      
    }
    else {
      this.props.navigation.navigate('NoCommunity')
    }
  }
  render() {
    return <Container style={styles.container} />
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8C9A9E',
    alignItems: 'center',
  }
});

const mapState = ({ user, communityTasks, taskItems }) => ({ user, communityTasks, taskItems })

const mapDispatch = null

export default connect(mapState, mapDispatch)(Play)