window.onload = function () {
  var newtodo = document.querySelector("#newtodo");
  var ullist = document.querySelector("#ullist");
  var todolist = JSON.parse(window.localStorage.getItem("todolist")) || [];
  // 获取全部删除按钮
  var deleteAll = document.querySelector('.clear-completed');
  var count = document.querySelector('.count');
  // 获取全选按钮
  var toggleAll = document.querySelector('#toggle-all');

  if (todolist.length === 0) {
    toggleAll.checked = false
  }

  newtodo.onkeydown = function (e) {
    if (e.keyCode == 13) {
      if (newtodo.value.trim().length === 0) {
        return;
      }
      addtodo(newtodo.value, todolist);
      this.value = "";
    }
  };

  deleteAll.onclick = function () {
    todolist = todolist.filter(function (item) {
      return item.isFinish === false;
    });
    window.localStorage.setItem('todolist', JSON.stringify(todolist))
    repaint(todolist)
  }
  
  toggleAll.addEventListener('click', function () {
    // 执行全选事件
    //   - 传递参数 arr
    //   - 传递参数 this
    activeAll(this, todolist)
  })

  window.addEventListener('hashchange', function () {
    // window.location.hash 能获取到当前的 hash
    // 根据当前的 hash 去处理数组，然后根据新数组去渲染页面就好
    // hash 为空 和 "#/" 都代表所有
    // hash 为 "#/active" 代表查看未完成
    // hash 为 "#/completed" 代表查看以完成
    // 因为是判断状态，所以使用 switch 判断比较方便
    switch (window.location.hash) {
      case '':
      case '#/':
        repaint(todolist)
        break;
      case '#/active':
        repaint(todolist.filter(function (item) {
          return item.isFinish === false
        }))
        break;
      case '#/completed':
        repaint(todolist.filter(function (item) {
          return item.isFinish === true
        }))
        break;
      default:
        break;
    }

    var statusList = document.querySelector('.filters').querySelectorAll('a');
    for (var i = 0; i < statusList.length; i++) {
      statusList[i].onclick = function () {
        for (var j = 0; j < statusList.length; j++) {
          statusList[j].classList.remove('selected')
        }
        this.classList.add('selected')
      }
    }
  })

  repaint(todolist);
  function addtodo(obj, todolist) {
    // console.log(todolist);
    if (obj.trim().length === 0) {
      // 到这里证明去除首尾空格以后是一个空字符串，直接返回什么都不做
      return;
    }
    // 默认数组中是按照 id 的大小排序的，所以我们只要拿到数组中最后一项的 id，然后 +1 就好
    var newId = !todolist.length ? 1 : todolist[todolist.length - 1]["id"] + 1;
    var newobj = {
      id: newId,
      content: obj,
      isFinish: false,
    };
    // console.log(newobj);
    todolist.push(newobj);
    window.localStorage.setItem('todolist', JSON.stringify(todolist))
    // console.log(todolist);
    repaint(todolist);
  }

  function repaint(todolist) {
    if (todolist.length == 0) {
      window.location.hash = ''
    }
    var str = "";
    for (let i = 0; i < todolist.length; i++) {
      const element = todolist[i];
      str += `<li id="${element.id}" class="${element.isFinish === false ? '' : 'completed'}">
                <div class="view">
                  <input class="toggle" type="checkbox" ${
                    element.isFinish === true ? "checked" : ""
                  }>
                  <label>${element.content}</label>
                  <button class="destroy"></button>
                </div>
                <input type="text" id="todo" value="${element.content}">
              </li>`;
    }
    ullist.innerHTML = str;

    var lilist = document.querySelectorAll("li");
    // console.log(lilist)
    for (let i = 0; i < lilist.length; i++) {
      lilist[i].ondblclick = function (e) {
        console.log(e.target)
        if (e.target.nodeName === "LABEL") {
          this.classList.add("edit");
          // console.log(this.childNodes);
          var todo = this.querySelector("#todo");
          // console.log(todo);
          var curretId = this.id;
          reset(todo, todolist, curretId);
        }
      };

      lilist[i].onclick = function (e) {
        if (e.target.className === "toggle") {
          var curretId = this.id;
          window.localStorage.setItem('todolist', JSON.stringify(todolist))
          finishTodo(todolist, curretId);
        }
        
        if (e.target.nodeName === "BUTTON") {
          var curretId = this.id;
          window.localStorage.setItem('todolist', JSON.stringify(todolist))
          deleteTodo(todolist, curretId);
        }
      };
    };

    var footer = document.querySelector(".footer");
    footer.style.display = todolist.length ? 'block' : 'none';

    countNum();
  
    var todolist1 = todolist.filter(function (item) {
      return item.isFinish === true;
    });
    if (todolist1.length == todolist.length) {
      toggleAll.checked = true;
    } else {
      toggleAll.checked = false;
    }
  }

  function finishTodo(todolist, curretId) {
    todolist.forEach(function (item, index) {
      if (item.id == curretId) {
        item.isFinish = ! item.isFinish;
      }
    });
    window.localStorage.setItem('todolist', JSON.stringify(todolist))
    console.log(todolist)
    repaint(todolist);
  }

  function deleteTodo(todolist, curretId) {
    todolist.forEach(function (item, index) {
      if (item.id == curretId) {
        todolist.splice(index, 1);
      }
    });
    window.localStorage.setItem('todolist', JSON.stringify(todolist))
    console.log(todolist)
    repaint(todolist);
  }

  function reset(todo, todolist, curretId) {
    var oldValue = todo.value;
    todo.onkeydown = function (e) {
      if (e.keyCode == 13) {
        this.blur();
      }
    };
    todo.onblur = function () {
      edit.call(this);
    };
    function edit() {
      if (this.value.trim() === oldValue) {
        console.log(todolist);
        window.localStorage.setItem('todolist', JSON.stringify(todolist))
        repaint(todolist);
        return;
      }
      // console.log(todolist);
      // console.log(this.value);
      if (this.value.trim().length === 0) {
        console.log(this.value);
        // 如果为空，那么删除数组中对应的数据
        todolist.forEach(function (item, index) {
          if (item.id == curretId) {
            todolist.splice(index, 1);
          }
        });
        window.localStorage.setItem('todolist', JSON.stringify(todolist))
        console.log(todolist);
      } else {
        // 如果不为空就去改变数组中的数据
        todolist.forEach(function (item, index) {
          if (item.id == curretId) {
            item.content = todo.value;
            item.isFinish = false;
          }
        });
        window.localStorage.setItem('todolist', JSON.stringify(todolist))
        console.log(todolist);
      }
      repaint(todolist);
    }
  }
  
  function countNum() {
    var todolist1 = todolist.filter(function (item) {
      return item.isFinish === false;
    });
    var str = `共有${todolist.length}条，剩余${todolist1.length}条未完成`
    count.innerHTML = str;
  }

  function activeAll(obj, todolist) {
    todolist.forEach(function (element) {
      element.isFinish = obj.checked;
    });
    window.localStorage.setItem('todolist', JSON.stringify(todolist));
    repaint(todolist);
  }
};
