

export function patch(oldVNode,newVNode){
  if (oldVNode.nodeType){
    //初次渲染
    const oldElm = oldVNode
    const parentElm = oldElm.parentNode
    let el = createElm(newVNode)
    parentElm.insertBefore(el,oldElm.nextSibling)
    parentElm.removeChild(oldElm)
    return el
  }else {
/**
 *
 *  diff比较新老VNode 将差异点更新到真实dom上去 并且是两颗树同级比较
 *
 *  1. 先比较父亲是否是可复用的节点
 *    2.1 判断是否是文本节点 
 *      3.1 如果是 文本内容不一致就直接更新
 *      3.2 如果不是文本节点就要比较儿子了
 *        4.1 如果新老vNode 都有儿子就直接去比较儿子
 *           5.1 比较儿子vue采用了一些优化策略 是针对业务场景中push pop shift unshift sort reverse 这些方法做了双指针的方式查找复用 老的头指针，老的尾指针 新的头指针 新的尾指针
 *           5.2 如果老的头指针 <= 老的尾指针 且新的头指针 <= 新的尾指针 开始查找
 *           5.3 如果不满足上述条件则结束查找 不满足上述条件可能会出现以下两种情况
 *              6.1 老的头指针指向的vNode和新的头指针指向的vNode是否相等
 *                  6.1.1 如果相等则 更新其属性然后递归更新儿子 重置指针以及指针指向的dom
 *              6.2 老的尾部指针指向的vNode 和新的尾部指针指向的vNode是否相等
 *                  6.2.1 如果相等则 更新其属性然后递归更新儿子 重置指针以及指针指向的dom
 *              6.3 老的头部指针指向的vNode 和 新的尾部指针指向的vNode是否相等
 *                  6.3.1 如果相等则 更新其属性然后递归更新儿子 重置指针以及指针指向的dom
 *              6.4 老的尾部指针指向的vNode 和 新的头部指向的vNode是否相等
 *                  6.4.1 如果相等则 更新其属性然后递归更新儿子 重置指针以及指针指向的dom
 *              6.5 上述条件都不满足 用新的开始指针指向的vNode的key 与老的虚拟dom 的key做的映射表中去查找 
 *                 6.5.1 如果查找到说明可以复用 拿到老的vNode 把老的原来要移动的位置置为空<防止数组塌陷> 把该节点插入到老的开始节点之前 然后去更新属性以及diff其孩子
 *                 6.5.2 如果没找到 直接创建并插入到老的开始节点dom的前面
 *           5.4 老的头指针 大于 老的尾指针
 *              5.4.1把新的虚拟dom 剩余的创建插入dom上去  注意插入的时候每次是插入到下一个dom的前面
 *           5.5 新的头指针 大于 新的尾指针
 *              5.5.1 把老的剩余的删除即可
 *        4.2 如果新的有儿子，老的没儿子就append儿子
 *        4.3 如果新的没儿子 老的有儿子直接删除老儿子
 *  1.1 如果不是直接创建新的dom去覆盖老的dom
 */
    //1.不是 可复用的 直接创建新的dom替换老的
    if (!isSameVNode(oldVNode,newVNode)){
      return oldVNode.el.parentNode.replaceChild(createElm(newVNode),oldVNode.el)
    }
    // 2.文本节点 内容不同直接更新 
    if (!oldVNode.tag){
      if (oldVNode.text !== newVNode.text){
        oldVNode.el.textContent = newVNode.text
      }
      return
    }
    let el = newVNode.el = oldVNode.el
    // 3.到达这里说明是可复用的节点 开始更新属性以及开始比较
    updateProperties(newVNode,oldVNode.data)
    let oldChildren = oldVNode.children || []
    let newChildren = newVNode.children || []
    if (oldChildren.length > 0 && newChildren.length > 0){
      //开始对比老儿子和新儿子
      updateChildren(oldChildren,newChildren,el)
    }else if (oldChildren.length > 0){
      // 新的没有 老的直接删除
      el.innerHTML = ''
    }else {
      // 老的没有 新的有直接创建
      newChildren.forEach(child =>{
        if (child) {
          el.appendChild(createElm(child))
        }
      })
    }
    return el
  }
}

function updateChildren(oldChildren,newChildren,parent){
  let oldStartIndex = 0
  let oldStartVNode = oldChildren[oldStartIndex]
  let oldEndIndex = oldChildren.length - 1
  let oldEndVNode = oldChildren[oldEndIndex]

  let newStartIndex = 0
  let newStartVNode = newChildren[newStartIndex]
  let newEndIndex = newChildren.length - 1
  let newEndVNode = newChildren[newEndIndex]

  let makeIndexByKey = (child) =>{
    let map = {}
    child.forEach((item,index) =>{
      if (item.key) {
        map[item.key] = index
      }
    })
    return map
  }
  let oldChildMap = makeIndexByKey(oldChildren)

  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    /**
     * 头头 尾尾 比较让头部删除或者头部追加或者尾部删除或者尾部追加 这种场景更高效找到复用  其实就是对应数组的push pop shift unshift 这些方法的优化
     * 头尾 尾头 指针比较主要优化 倒序 以及部分排序 让其更快的找到复用 针对数组的 reverse sort 等场景
    */
    if (!oldStartVNode){
      // 后面暴力比对置空导致的场景
      oldStartVNode = oldChildren[++oldStartIndex]
    }else if (!oldEndVNode){
      oldEndVNode = oldChildren[--oldEndIndex]
    }else if (isSameVNode(oldStartVNode,newStartVNode)){
      patch(oldStartVNode,newStartVNode)
      oldStartVNode = oldChildren[++oldStartIndex]
      newStartVNode = newChildren[++newStartIndex]
    }else if (isSameVNode(oldEndVNode, newEndVNode)) {
			patch(oldEndVNode, newEndVNode);
			oldEndVNode = oldChildren[--oldEndIndex];
			newEndVNode = newChildren[--newEndIndex];
		}else if (isSameVNode(oldStartVNode, newEndVNode)) {
			patch(oldStartVNode, newEndVNode);
      //将当前元素插入到尾部的下一个元素前面
			parent.insertBefore(oldStartVNode.el, oldEndVNode.el.nextSibling);
			oldStartVNode = oldChildren[++oldStartIndex];
			newEndVNode = newChildren[--newEndIndex];
		}else if (isSameVNode(oldEndVNode, newStartVNode)) {
			patch(oldEndVNode, newStartVNode);
      //将当前元素插入到当前第一个元素前面
			parent.insertBefore(oldEndVNode.el, oldStartVNode.el);
			oldEndVNode = oldChildren[--oldEndIndex];
			newStartVNode = newChildren[++newStartIndex];
		}else {
      //暴力比较
      let moveIndex = oldChildMap[newStartVNode.key]
      if (moveIndex === undefined){
        parent.insertBefore(createElm(newStartVNode),oldStartVNode.el)
      }else {
        let moveVNode = oldChildren[moveIndex]
        oldChildren[moveIndex] = null
        parent.insertBefore(createElm(moveVNode),oldStartVNode.el)
        patch(moveVNode,newStartVNode)
      }
      newStartVNode = newChildren[++newStartIndex]
    }
  }

  // 处理老节点还有剩余的
  if (oldStartIndex <= oldEndIndex){
    for (let index = oldStartIndex; index <= oldEndIndex; index++) {
      let child = oldChildren[index]
      if (child){
        parent.removeChild(child.el)
      }
    }
  }
  // 处理新的没有比完的情况
  if (newStartIndex <= newEndIndex){
    for (let index = newStartIndex; index <= newEndIndex; index++) {
      let child = newChildren[index]
      let nextEle = newChildren[newEndIndex + 1]?newChildren[newEndIndex+1].el:null
      parent.insertBefore(createElm(child),nextEle)
    }
  }


}


function isSameVNode(oldVNode,newVNode){
  return oldVNode.tag === newVNode.tag && oldVNode.key === newVNode.key
}

export function createElm(vNode){
  let { tag, children, text } = vNode
  if (typeof tag === 'string'){
    vNode.el = document.createElement(tag)
    //更新属性
    updateProperties(vNode)
    //字节点递归生成
    children.forEach(child => {
      return vNode.el.appendChild(createElm(child))
    })
  }else {
    vNode.el = document.createTextNode(text)
  }
  return vNode.el
}
function updateProperties(vNode,oldProps={}) {
  let newProps = vNode.data || {}
  let el = vNode.el;

	//老的有新的没有，需要删除
	for (let key in oldProps) {
		if (!newProps[key]) {
			el.removeAttribute(key);
		}
	}
	let newStyle = newProps.style || {};
	let oldStyle = oldProps.style || {};
	for (let key in oldStyle) {
		if (!newStyle[key]) {
			el.style[key] = '';
		}
	}
	//新的有  直接用新的
	for (let key in newProps) {
		if (key == 'style') {
			for (let styleName in newProps.style) {
				el.style[styleName] = newProps.style[styleName];
			}
		} else if (key == 'class') {
			el.className = newProps.class;
		} else {
			el.setAttribute(key, newProps[key]);
		}
	}
}