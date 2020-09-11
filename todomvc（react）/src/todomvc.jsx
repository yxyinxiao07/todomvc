import React from "react";
import "./todomvc.css";

class Add extends React.Component {
  onkeydown = (e) => {
    if (e.keyCode === 13) {
      var obj = this.refs.input.value;
      this.props.addTodo(obj);
      this.refs.input.value = "";
    }
  };
  render() {
    return (
      <div className="newtodos">
        <input
          id="toggle-all"
          className="toggle-all"
          type="checkbox"
          checked={
            this.props.todolist.length ===
            this.props.todolist.filter(function (item) {
              return item.isFinish === true;
            }).length
              ? "checked"
              : ""
          }
          onChange={this.props.finishATodo}
        />
        <input
          type="text"
          ref="input"
          id="newtodo"
          placeholder="what have to do"
          onKeyDown={(e) => this.onkeydown(e)}
        />
      </div>
    );
  }
}

class List extends React.Component {
  state = {
    currentState: "",
  };
  dlclick = (e, index) => {
    if (e.target.nodeName === "LABEL") {
      this.setState({
        currentState: index,
      });
    }
  };
  onkeydown = (id, e) => {
    if (e.keyCode === 13) {
      this.setState({
        currentState: "",
      });
      this.props.changeTodo(id, e);
    }
  };
  onblur = (id, e) => {
    this.setState({
      currentState: "",
    });
    this.props.changeTodo(id, e);
  };
  render() {
    return (
      <div className="todos">
        <ul id="ullist">
          {this.props.currentList.map((element, index) => {
            return (
              <li
                ref="edittodo"
                id={element.id}
                key={index}
                onDoubleClick={(e) => this.dlclick(e, index)}
                className={
                  (element.isFinish === false ? "" : "completed") +
                  " " +
                  (this.state.currentState === index ? "edit" : "")
                }
              >
                <div className="view">
                  <input
                    className="toggle"
                    type="checkbox"
                    checked={element.isFinish === true ? "checked" : ""}
                    onChange={(e) => this.props.finishTodo(element.id)}
                  />
                  <label>{element.content}</label>
                  <button
                    className="destroy"
                    onClick={(e) => this.props.deleteTodo(element.id)}
                  ></button>
                </div>
                <input
                  type="text"
                  className="todo"
                  value={element.content}
                  ref="editinput"
                  onChange={(e) => this.props.changeTodo(element.id, e)}
                  onKeyDown={(e) => this.onkeydown(element.id, e)}
                  onBlur={(e) => this.onblur(element.id, e)}
                />
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

class Footer extends React.Component {
  state = {
    navList: [
      {
        id: 0,
        navName: "全部",
        path: "#/",
        type: 1,
      },
      {
        id: 1,
        navName: "未完成",
        path: "#/active",
        type: 0,
      },
      {
        id: 2,
        navName: "已完成",
        path: "#/completed",
        type: 0,
      },
    ],
  };
  render() {
    return (
      <div
        className="footer"
        style={{ display: this.props.todolist.length ? "block" : "none" }}
      >
        <span
          className="count"
          style={{ display: this.props.todolist.length ? "block" : "none" }}
          dangerouslySetInnerHTML={{ __html: this.props.countcontent }}
        ></span>
        <ul className="filters">
          {this.state.navList.map((item, index) => {
            return (
              <li key={index}>
                <a
                  className={
                    item.path === window.location.hash ? "selected" : ""
                  }
                  href={item.path}
                >
                  {item.navName}
                </a>
              </li>
            );
          })}
        </ul>
        <button className="clear-completed" onClick={this.props.deleteComplete}>
          清除已完成
        </button>
      </div>
    );
  }
}

export default class Todomvc extends React.Component {
  state = {
    todolist: JSON.parse(window.localStorage.getItem("todolist")) || [],
    todolist1: [],
    currentList: [],
    countcontent: "",
    navList: [
      {
        id: 0,
        navName: "全部",
        path: "#/",
        type: 1,
      },
      {
        id: 1,
        navName: "未完成",
        path: "#/active",
        type: 0,
      },
      {
        id: 2,
        navName: "已完成",
        path: "#/completed",
        type: 0,
      },
    ],
  };
  addTodo = (obj) => {
    if (obj.trim().length === 0) {
      // 到这里证明去除首尾空格以后是一个空字符串，直接返回什么都不做
      return;
    }
    var todolist = this.state.todolist;
    // 默认数组中是按照 id 的大小排序的，所以我们只要拿到数组中最后一项的 id，然后 +1 就好
    var newId = !todolist.length ? 1 : todolist[todolist.length - 1]["id"] + 1;
    var newobj = {
      id: newId,
      content: obj,
      isFinish: false,
    };
    todolist.push(newobj);
    this.resetTodo(todolist);
  };
  changeTodo = (id, e) => {
    var newtodolist = this.state.todolist;
    newtodolist.forEach(function (item, index) {
      if (item.id === id) {
        if (e.target.value === "") {
          newtodolist.splice(index, 1);
        } else {
          item.content = e.target.value;
        }
      }
    });
    this.resetTodo(newtodolist);
  };
  resetTodo = (newtodolist) => {
    this.setState({
      todolist: newtodolist,
    });
    window.localStorage.setItem(
      "todolist",
      JSON.stringify(this.state.todolist)
    );
    this.setState({
      countcontent:
        "共有" +
        this.state.todolist.length +
        "条，剩余" +
        this.state.todolist.filter(function (item) {
          return item.isFinish === false;
        }).length +
        "条未完成",
    });
  };
  finishTodo = (id) => {
    var newtodolist = this.state.todolist;
    newtodolist.forEach(function (item, index) {
      if (item.id === id) {
        item.isFinish = !item.isFinish;
      }
    });
    this.resetTodo(newtodolist);
  };
  finishATodo = () => {
    var newtodolist = this.state.todolist;
    var newtodolist1 = this.state.todolist.filter(function (item) {
      return item.isFinish === true;
    });
    newtodolist.forEach(function (item, index) {
      if (newtodolist1.length === newtodolist.length) {
        return (item.isFinish = false);
      } else {
        return (item.isFinish = true);
      }
    });
    this.resetTodo(newtodolist);
  };
  deleteTodo = (id) => {
    var newtodolist = this.state.todolist;
    newtodolist.forEach(function (item, index) {
      if (item.id === id) {
        newtodolist.splice(index, 1);
      }
    });
    this.resetTodo(newtodolist);
  };
  deleteComplete = () => {
    this.setState(
      {
        todolist: this.state.todolist.filter(function (item) {
          return item.isFinish === false;
        }),
      },
      () => {
        this.resetTodo(this.state.todolist);
      }
    );
  };
  componentDidMount() {
    this.setState({
      countcontent:
        "共有" +
        this.state.todolist.length +
        "条，剩余" +
        this.state.todolist.filter(function (item) {
          return item.isFinish === false;
        }).length +
        "条未完成",
    });
    switch (window.location.hash) {
      case "":
      case "#/":
        this.setState({
          currentList: this.state.todolist,
        });
        break;
      case "#/active":
        this.setState({
          currentList: this.state.todolist.filter(function (item) {
            return item.isFinish === false;
          }),
        });
        break;
      case "#/completed":
        this.setState({
          currentList: this.state.todolist.filter(function (item) {
            return item.isFinish === true;
          }),
        });
        break;
      default:
        break;
    }
    var that = this;
    window.addEventListener("hashchange", function () {
      // window.location.hash 能获取到当前的 hash
      // 根据当前的 hash 去处理数组，然后根据新数组去渲染页面就好
      // hash 为空 和 "#/" 都代表所有
      // hash 为 "#/active" 代表查看未完成
      // hash 为 "#/completed" 代表查看以完成
      // 因为是判断状态，所以使用 switch 判断比较方便
      switch (window.location.hash) {
        case "":
        case "#/":
          that.setState({
            currentList: that.state.todolist,
          });
          break;
        case "#/active":
          that.setState({
            currentList: that.state.todolist.filter(function (item) {
              return item.isFinish === false;
            }),
          });
          break;
        case "#/completed":
          that.setState({
            currentList: that.state.todolist.filter(function (item) {
              return item.isFinish === true;
            }),
          });
          break;
        default:
          break;
      }
    });
  }
  render() {
    var todolist = this.state.todolist;
    var todolist1 = this.state.todolist1;
    var currentList = this.state.currentList;
    var countcontent = this.state.countcontent;
    var navList = this.state.navList;
    return (
      <div className="container">
        <h1>my todos</h1>
        <Add
          todolist={todolist}
          addTodo={this.addTodo}
          finishATodo={this.finishATodo}
        />
        <List
          todolist={todolist}
          currentList={currentList}
          changeTodo={this.changeTodo}
          resetTodo={this.resetTodo}
          finishTodo={this.finishTodo}
          deleteTodo={this.deleteTodo}
        />
        <Footer
          todolist={todolist}
          navList={navList}
          todolist1={todolist1}
          countcontent={countcontent}
          deleteComplete={this.deleteComplete}
          changeType={this.changeType}
        />
        <p>回车确认添加修改，双击可编辑</p>
      </div>
    );
  }
}
