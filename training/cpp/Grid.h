// myobject.h
#ifndef GRID_H
#define GRID_H

#include <node.h>
#include <node_object_wrap.h>

#include <vector>

namespace tetris {

class Grid : public node::ObjectWrap {
 public:
  static void Init(v8::Local<v8::Object> exports);

 private:
    explicit Grid(int width, int height);
    explicit Grid(std::vector<std::vector<int>> grid);
    ~Grid();

    static void New(const v8::FunctionCallbackInfo<v8::Value>& args);
    static void total(const v8::FunctionCallbackInfo<v8::Value>& args);

    static void getPosition(const v8::FunctionCallbackInfo<v8::Value>& args);
    static void setPosition(const v8::FunctionCallbackInfo<v8::Value>& args);
    static void sweep(const v8::FunctionCallbackInfo<v8::Value>& args);
    static void getGridHeight(const v8::FunctionCallbackInfo<v8::Value>& args);
    static void getCurrentHeight(const v8::FunctionCallbackInfo<v8::Value>& args);
    bool isRowFull(int y);
    static void getHoleCount(const v8::FunctionCallbackInfo<v8::Value>& args);
    static void getFullCount(const v8::FunctionCallbackInfo<v8::Value>& args);
    int getColHeight(int x);
    static void getBumpiness(const v8::FunctionCallbackInfo<v8::Value>& args);
    static void getRowsWithHoles(const v8::FunctionCallbackInfo<v8::Value>& args);

    static void getGrid(const v8::FunctionCallbackInfo<v8::Value>& args);

    static v8::Persistent<v8::Function> constructor;


  std::vector<std::vector<int>> grid_;
};

}  // namespace tetris

#endif