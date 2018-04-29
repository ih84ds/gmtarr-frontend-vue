const state = {
 paths: {
  home: {
    path: '/',
    children: [

    ]
  }
 }
}

const getters = {
  getPathItems: (state) => (path) => {
    // use the router path variable to determine what to show in the breadgrumb links
    let items = [{
      text: 'Home',
      routerPath: '/'
    }]
    let regex = [
      /\/leagues\/[0-9]+/,
      /\/leagues\/[0-9]+\/flights\/[0-9]+/
    ]
    if (Array.isArray(path.match(regex[0]))) {
      items.push(
        {
          text: 'League',
          routerPath: path.match(regex[0])[0]
        }
      )
    }
    if (Array.isArray(path.match(regex[1]))) {
      items.push(
        {
          text: 'Flight',
          routerPath: path.match(regex[1])[0]
        }
      )
    }
    return items
  }
}

const namespaced = true

export default {
  namespaced,
  getters,
  state
}
