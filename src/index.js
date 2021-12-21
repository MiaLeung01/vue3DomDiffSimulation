
// const sampleVnode = {
//   tag: 'div',
//   //  An object for storing node properties , Of the corresponding node el[prop] attribute , for example onclick , style
//   data: {
//     class: 'test'
//   },
//   children: [ //  Array to store child nodes 
//     {
//       tag: 'span',
//       data: {
//           class: 'demo'
//       },
//       text: 'hello,VNode'
//     }
//   ],
//   text: '',
//   // 真实的 dom node
//   elm: div, 
// }


function vnode (sel, data, children, text, elm) {
  return {
    sel,
    data,
    children,
    text,
    elm
  }
}

function h (sel, data, params) {
  if (typeof params === 'string') {
    return vnode(sel, data, undefined, params, undefined)
  }
  if (Array.isArray(params)) {
    return vnode(sel, data, params, undefined, undefined)
  }
}

/**
 * 创建真实 dom 结点
 * @param vnode 虚拟节点
 */
 function createElement (vnode) {
  let domNode = document.createElement(vnode.sel)
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
  if (oldVnode.sel === newVnode.sel) {

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
      // 1.3.1 结点没有 key
      if (!newVnode.data.key) {
        pacthUnkeyedChildren(oldVnode, newVnode)
      }
      // 1.3.2 结点有 key ==> diff 算法
    }
  }

  // 2.不同结点，直接删除旧结点，插入新节点
  if (oldVnode.sel !== newVnode.sel) {
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
/**
 * 
 * @param {*} oldVnode 
 * @param {*} newVnode 
 */
function pacthKeyedChildren (oldVnode, newVnode) {
  oldVnode
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



const button = document.getElementById('btn')

let vnode0 = h('div', {}, 'hello')


let vnode1 = h('ul', {},  [
  h('li', {}, 'a'),
  h('li', {}, 'd')
])
let vnode2 = h('ul', {}, [
  h('li', {}, 'a'),
  h('li', {}, 'b'),
  h('li', {}, 'c'),
  h('li', {}, 'd')
])

console.log('vnode1', vnode1)
console.log('vnode2', vnode2)

document.getElementById('app').appendChild(createElement(vnode1))


button.onclick = () => {
  patch(vnode1, vnode2)
}