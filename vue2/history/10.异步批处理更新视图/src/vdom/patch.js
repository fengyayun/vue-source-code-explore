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
    //diff
  }
}

function createElm(vNode){
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