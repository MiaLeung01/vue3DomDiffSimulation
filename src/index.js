
// const sampleVnode = {
//   tag: 'div',
//   // An object for storing node properties , 
//   // Of the corresponding node el[prop] attribute 
//   // , for example onclick , style
//   props: {
//     class: 'test'
//   },
//   children: [ //  Array to store child nodes 
//     {
//       tag: 'span',
//       props: {
//           class: 'demo'
//       },
//       text: 'hello,VNode'
//     }
//   ],
//   text: '',
//   // 真实的 dom node
//   elm: div, 
// }

/**
 * 
 * @param {string} tag 标签名
 * @param {Object} props 属性
 * @param {Array} children 子节点
 * @param {string} text 文本结点
 * @param {Dom} elm 真实的 dom 结点
 * @returns VNode Object
 */
function vnode (tag, props, children, text, elm) {
  return {
    tag,
    props,
    children,
    text,
    elm
  }
}
/**
 * 
 * @param {string} tag 标签名
 * @param {Object} props 属性
 * @param {string | Array} params 参数
 * @returns VNode Object
 */
function h (tag, props, params) {
  if (typeof params === 'string') {
    const node = vnode(tag, props, undefined, params, undefined)
    console.log(node)
    return node
  }
  if (Array.isArray(params)) {
    const node = vnode(tag, props, params, undefined, undefined)
    console.log(node)
    return node
  }
}

/**
 * 创建真实 dom 结点
 * @param vnode 虚拟节点
 */
 function createElement (vnode) {
  let domNode = document.createElement(vnode.tag)
  if (vnode.children && vnode.children.length) {
    vnode.children.forEach(el => {
      domNode.appendChild(createElement(el))
    })
  } else {
    domNode.innerText = vnode.text
  }
  vnode.elm = domNode
  return domNode
}

/**
 * 
 * @param {*} oldVnode 
 * @param {*} newVnode 
 * 
 * 1. 新老节点不同，直接替换
 */
function patch(oldVnode, newVnode) {

  // 1. 相同结点
  if (oldVnode.tag === newVnode.tag) {

    // 1.1 新节点没有 children，说明是文本，直接覆盖
    if (!newVnode.children && (!oldVnode.children || (oldVnode.children && !oldVnode.children.length))) {
      if (newVnode.text !== oldVnode.text) {
        oldVnode.elm.innerText = newVnode.text
      }
    }

    // 1.2 新节点有 children，旧没有，直接插入
    if (newVnode.children && (!oldVnode.children || (oldVnode.children && !oldVnode.children.length))) {
      oldVnode.elm.innerText = ''
      newVnode.children.forEach(el => {
        oldVnode.elm.appendChild(createElement(el))
      })
    }

    // 1.3 新旧节点都有 children
    if (newVnode.children && oldVnode.children) {
      pacthKeyedChildren(oldVnode, newVnode)
    }
  }

  // 2.不同结点，直接删除旧结点，插入新节点
  if (oldVnode.tag !== newVnode.tag) {
    const newVnodeElement = createElement(newVnode)
    console.log('newVnode', newVnodeElement)
    // 旧的 elm 就是真的结点
    let oldVnodeElement = oldVnode.elm
    // 新换掉旧
    if (newVnodeElement) {
      oldVnodeElement.parentNode.insertBefore(newVnodeElement, oldVnodeElement)
    }
    // 删掉旧
    oldVnodeElement.parentNode.removeChild(oldVnodeElement)
  }
}

function patchCildren(oldVnode, newVnode) {
  // if (!newVnode.props.key) {
  //   pacthUnkeyedChildren(oldVnode, newVnode)
  // } else {
    // 1.3.2 结点有 key ==> diff 算法
    pacthKeyedChildren(oldVnode, newVnode)
  // }
}

/**
 * 
 * @param {*} oldVnode 
 * @param {*} newVnode 
 */
 function pacthUnkeyedChildren (oldVnode, newVnode) {
  const oldChildren = oldVnode.children
  const newChildren = newVnode.children
  const commonLength = Math.min(oldChildren.length, newChildren.length)
  // 依次遍历子节点 patch
  for (let i = 0; i< commonLength; i++) {
    patch(oldChildren[i], newChildren[i])
  }
  // 老vnode 数量大于新的vnode，删除多余的节点
  if (oldChildren.length > newChildren.length) {
    for (let i=commonLength; i < oldChildren.length; i++) {
      oldVnode.elm.removeChild(oldChildren[i].elm)
    }
  } else {
    // 新多于旧，插入剩余结点
    for (let i=commonLength; i < newChildren.length; i++) {
      oldVnode.elm.appendChild(createElement(newChildren[i]))
    }
  }
}


/**
 * 
 * @param {*} oldVnode 
 * @param {*} newVnode 
 */
 function pacthKeyedChildren (oldVnode, newVnode) {
  const oldChildren = oldVnode.children
  const newChildren = newVnode.children
  let oldStartIndex = 0,
    oldEndIndex = oldChildren.length - 1
    newStartIndex = 0,
    newEndIndex = newChildren.length - 1;
  let oldStartNode = oldChildren[oldStartIndex],
    oldEndNode = oldChildren[oldEndIndex],
    newStartNode = newChildren[newStartIndex],
    newEndNode = newChildren[newEndIndex];
  
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (oldStartNode === undefined) {
      oldStartNode = oldChildren[++oldStartIndex]
    } else if (oldEndNode === undefined) {
      oldEndNode = oldChildren[--oldEndIndex]
    } else if (oldStartNode.props.key === newStartNode.props.key) {
      console.log(1)
      // 1. 旧前 === 新前
      patch(oldStartNode, newStartNode)
      newStartNode.elm = oldStartNode.elm

      oldStartIndex++
      newStartIndex++
      oldStartNode = oldChildren[oldStartIndex]
      newStartNode = newChildren[newStartIndex]
    } else if (oldEndNode.props.key === newEndNode.props.key) {
      console.log(2)
      // 2. 旧后 === 新后
      patch(oldEndNode, newEndNode)
      newEndNode.elm = oldEndNode.elm
      oldEndIndex--
      newEndIndex--
      oldEndNode = oldChildren[oldEndIndex]
      newEndNode = newChildren[newEndIndex]
    } else if (oldStartNode.props.key === newEndNode.props.key) {
      console.log(3)
      // 3.旧前 === 新后
      patch(oldStartNode, newEndNode)
      newEndNode.elm = oldStartNode.elm
      // 将旧前移到旧后的后面
      oldVnode.elm.insertBefore(oldStartNode.elm, oldEndNode.elm.nextSibling)

      oldStartIndex++
      newEndIndex--
      oldStartNode = oldChildren[oldStartIndex]
      newEndNode = newChildren[newEndIndex]
    } else if (oldEndNode.props.key === newStartNode.props.key) {
      console.log(4)
      // 4. 旧后 === 新前
      patch(oldEndNode, newStartNode)
      newStartNode.elm = oldEndNode.elm
      // 将旧后移到旧前的前面
      oldVnode.elm.insertBefore(oldEndNode.elm, oldStartNode.elm)

      oldEndIndex--
      newStartIndex++
      oldEndNode = oldChildren[oldEndIndex]
      newStartNode = newChildren[newStartIndex]
    } else {
      // 5. 上面四种均不匹配，在旧子节点 找到 新头的位置
      let newKey = newStartNode.props.key
      oldIndex = oldChildren.findIndex(child => child.props.key === newKey)
      if (oldIndex > -1) {
        // 5.1 找到了，移动找到的结点到新位置
        let oldNode = oldChildren[oldIndex]
        patch(oldNode, newStartNode)
        newStartNode.elm = oldNode.elm
        oldVnode.elm.insertBefore(oldNode.elm, oldStartNode.elm)
        oldChildren[oldIndex] = undefined
      } else {
        // 5.2 没找到，新增一个放到头
        let nodeEl = createElement(newStartNode)
        oldVnode.elm.insertBefore(nodeEl, oldStartNode.elm)
      }
      newStartNode = newChildren[++newStartIndex]
    }
  }

  // 6. 添加结点
  if (oldEndIndex < oldStartIndex) {
    for (let i = newStartIndex; i<=newEndIndex; i++) {
      const newElm = createElement(newChildren[i])
      const before = newChildren[newEndIndex+1]
      console.log(oldStartNode)
      oldVnode.elm.insertBefore(newElm, before.elm)
    }
  } else if (newStartIndex > newEndIndex) {
    for (let i = oldStartIndex; i<=oldEndIndex; i++) {
      oldVnode.elm.removeChild(oldChildren[i].elm)
    }
  }
}


// 1. VNode => 页面 s1
const btnS1 = document.getElementById('s1button')
btnS1.onclick = () => {
  const v = h('div', {}, 'hello')
  document.getElementById('s1').appendChild(
    createElement(v)
  )
}

// 2. 单个 VNode 的修改 (patch)
/**
 * 结点相同，新节点没有 children
 */
// const s2Vnode1 = h('div', {},  [
//   h('span', {}, 'a'),
// ])
// const s2Vnode2 = h('div', {}, 'hello')


const s2Vnode1 = h('ul', {},  [
      h('li', {}, 'a'),
      h('li', {}, 'b'),
      h('li', {}, 'd'),
      h('li', {}, 'c'),
    ])
const s2Vnode2 = h('div', {}, 'hello')
document.getElementById('s2').appendChild(
  createElement(s2Vnode1)
)
const btnS2 = document.getElementById('s2button')
btnS2.onclick = () => {
  patch(s2Vnode1, s2Vnode2)
}

// 3. patch 无 key 的子节点
const s3Vnode1 = h('ul', {},  [
  h('li', {}, 'a'),
  h('li', {}, 'b'),
  h('li', {}, 'd'),
  h('li', {}, 'c'),
])
const s3Vnode2= h('ul', {},  [
  h('li', {}, 'b'),
  h('li', {}, 'a'),
  h('li', {}, 'c'),
])
document.getElementById('s3').appendChild(
  createElement(s3Vnode1)
)
const btnS3 = document.getElementById('s3button')
btnS3.onclick = () => {
  pacthUnkeyedChildren(s3Vnode1, s3Vnode2)
}

const button = document.getElementById('btn')

let vnode0 = h('div', {}, 'hello')

// 1-4
// let vnode1 = h('ul', {},  [
//   h('li', { key: 'a'}, 'a'),
//   h('li', { key: 'b'}, 'b'),
//   h('li', { key: 'c'}, 'c'),
//   h('li', { key: 'd'}, 'd'),
// ])
// let vnode2 = h('ul', {}, [
//   h('li', { key: 'd' }, 'dddd'),
//   h('li', { key: 'b' }, 'bbbb'),
//   h('li', { key: 'a' }, 'aaaa'),
//   h('li', { key: 'c' }, 'cccc'),
// ])

// 5.1 非理想情况
// let vnode1 = h('ul', {},  [
//   h('li', { key: 'a'}, 'a'),
//   h('li', { key: 'b'}, 'b'),
//   h('li', { key: 'c'}, 'c'),
//   h('li', { key: 'd'}, 'd'),
// ])
// let vnode2 = h('ul', {}, [
//   h('li', { key: 'b' }, 'bbbb'),
//   h('li', { key: 'd' }, 'dddd'),
//   h('li', { key: 'a' }, 'aaaa'),
//   h('li', { key: 'c' }, 'cccc'),
// ])

// // 6. 添加结点
// let vnode1 = h('ul', {},  [
//   h('li', { key: 'a'}, 'a'),
//   h('li', { key: 'b'}, 'b'),
//   h('li', { key: 'c'}, 'c'),
// ])
// let vnode2 = h('ul', {}, [
//   h('li', { key: 'a' }, 'aaaa'),
//   h('li', { key: 'b' }, 'bbbb'),
//   h('li', { key: 'd' }, 'dddd'),
//   h('li', { key: 'e' }, 'eee'),
//   h('li', { key: 'c' }, 'cccc'),
// ])

// // 7. 删除结点
let vnode1 = h('ul', {},  [
  h('li', { key: 'a'}, 'a'),
  h('li', { key: 'b'}, 'b'),
  h('li', { key: 'd' }, 'd'),
  h('li', { key: 'c'}, 'c'),
])
let vnode2 = h('ul', {}, [
  h('li', { key: 'b' }, 'bbbb'),
  h('li', { key: 'a' }, 'aaaa'),
  h('li', { key: 'c' }, 'cccc'),
])

console.log('vnode1', vnode1)
console.log('vnode2', vnode2)

document.getElementById('app').appendChild(createElement(vnode1))


button.onclick = () => {
  patch(vnode1, vnode2)
}


const vNode = 
{
  tag: 'ul',
  props: { 
    id:'app',
    class:'container'
  },
  children: [
    { 
      tag: 'li',
      children: '你好啊'
    }
  ]
}
