#include "Grid.h"

#include <algorithm>
#include <cmath>

namespace tetris {

using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::Array;
using v8::Persistent;
using v8::String;
using v8::Value;

Persistent<Function> Grid::constructor;

Grid::Grid(int width, int height): grid_(height) {
    std::vector<int> row(width, 0);
    std::fill(grid_.begin(), grid_.end(), row);
}

Grid::Grid(std::vector<std::vector<int>> grid) : grid_(grid) {
}

Grid::~Grid() {
}

void Grid::Init(Local<Object> exports) {
  Isolate* isolate = exports->GetIsolate();

  // Prepare constructor template
  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New);
  tpl->SetClassName(String::NewFromUtf8(isolate, "Grid"));
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  // Prototype
  NODE_SET_PROTOTYPE_METHOD(tpl, "total", total);
  NODE_SET_PROTOTYPE_METHOD(tpl, "getPosition", getPosition);
  NODE_SET_PROTOTYPE_METHOD(tpl, "setPosition", setPosition);
  NODE_SET_PROTOTYPE_METHOD(tpl, "sweep", sweep);
  NODE_SET_PROTOTYPE_METHOD(tpl, "getGridHeight", getGridHeight);
  NODE_SET_PROTOTYPE_METHOD(tpl, "getCurrentHeight", getCurrentHeight);
  //NODE_SET_PROTOTYPE_METHOD(tpl, "isRowFull", isRowFull);
  NODE_SET_PROTOTYPE_METHOD(tpl, "getHoleCount", getHoleCount);
  NODE_SET_PROTOTYPE_METHOD(tpl, "getFullCount", getFullCount);
  NODE_SET_PROTOTYPE_METHOD(tpl, "getBumpiness", getBumpiness);
  NODE_SET_PROTOTYPE_METHOD(tpl, "getRowsWithHoles", getRowsWithHoles);

  NODE_SET_PROTOTYPE_METHOD(tpl, "getGrid", getGrid);

  constructor.Reset(isolate, tpl->GetFunction());
  exports->Set(String::NewFromUtf8(isolate, "Grid"),
               tpl->GetFunction());
}

void Grid::New(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  if (args.IsConstructCall()) {
    // Invoked as constructor: `new MyObject(...)`
    //save the args sent to the constructor
    //double value = args[0]->IsUndefined() ? 0 : args[0]->NumberValue();
    if (args[1]->IsUndefined()) {
        std::vector<std::vector<int>> grid;

        Local<Array> input = Local<Array>::Cast(args[0]);
        for (unsigned int i = 0; i < input->Length(); i++) {
            std::vector<int> row;
            Local<Array> inputRow = Local<Array>::Cast(input->Get(i));
            for (unsigned int j = 0 ; j < inputRow->Length() ; j++) {
                row.push_back(inputRow->Get(j)->NumberValue());
            }
            grid.push_back(row);
        }

        Grid* obj = new Grid(grid);
        obj->Wrap(args.This());
        args.GetReturnValue().Set(args.This());
    }
    else {
        Grid* obj = new Grid(args[0]->NumberValue(), args[1]->NumberValue());
        obj->Wrap(args.This());
        args.GetReturnValue().Set(args.This());
    }
  }
//   else {
//     // Invoked as plain function `MyObject(...)`, turn into construct call.
//     const int argc = 1;
//     Local<Value> argv[argc] = { args[0] };
//     Local<Context> context = isolate->GetCurrentContext();
//     Local<Function> cons = Local<Function>::New(isolate, constructor);
//     Local<Object> result =
//         cons->NewInstance(context, argc, argv).ToLocalChecked();
//     args.GetReturnValue().Set(result);
//   }
}

void Grid::total(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  Grid* obj = ObjectWrap::Unwrap<Grid>(args.Holder());
  //do stuff with my object
  int sum = 0;
  for (std::vector<int> row : obj->grid_) {
      for (int i : row) {
          sum += i;
      }
  }

  args.GetReturnValue().Set(Number::New(isolate, sum));
}

void Grid::getPosition(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  Grid* obj = ObjectWrap::Unwrap<Grid>(args.Holder());
  //do stuff with my object
  int x = args[0]->NumberValue();
  int y = args[1]->NumberValue();
  int num = obj->grid_[y][x];

  args.GetReturnValue().Set(Number::New(isolate, num));
}

void Grid::setPosition(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  Grid* obj = ObjectWrap::Unwrap<Grid>(args.Holder());
  //do stuff with my object
  int x = args[0]->NumberValue();
  int y = args[1]->NumberValue();
  int num = args[2]->NumberValue();
  obj->grid_[y][x] = num;
}

void Grid::sweep(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();

    Grid* obj = ObjectWrap::Unwrap<Grid>(args.Holder());

    unsigned int counter = 0;

    for (int y = 0 ; y < obj->grid_.size() ; y++) {
        if (obj->isRowFull(y)) {
            counter++;
            for (int i = y ; i > 0 ; i--) {
                obj->grid_[i] = obj->grid_[i - 1];
            }
            std::vector<int> newRow(obj->grid_[0].size(), 0);
            obj->grid_[0] = newRow;
        }
    }
    
    Local<Function> cb = Local<Function>::Cast(args[0]);

    const unsigned argc = 2;
    Local<Value> argv[argc] = { Number::New(isolate, counter), args[1] };
    cb->Call(Null(isolate), argc, argv);
}

void Grid::getGridHeight(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();

    Grid* obj = ObjectWrap::Unwrap<Grid>(args.Holder());

    args.GetReturnValue().Set(Number::New(isolate, obj->grid_.size()));
}

void Grid::getCurrentHeight(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();

    Grid* obj = ObjectWrap::Unwrap<Grid>(args.Holder());

    int maxHeight = 0;
    for (int y = 0 ; y < obj->grid_.size() ; y++) {
        for (int x = 0 ; x < obj->grid_[y].size() ; x++) {
            if (obj->grid_[y][x] != 0) {
                maxHeight = obj->grid_.size() - y;
                break;
            }
        }
        if (maxHeight != 0) {
            break;
        }
    }

    args.GetReturnValue().Set(Number::New(isolate, maxHeight));
}

bool Grid::isRowFull(int y) {
    bool full = true;
    for (int num : grid_[y]) {
        if (num == 0) {
            full = false;
        }
    }

    return full;
}

void Grid::getHoleCount(const FunctionCallbackInfo<Value>& args) {

    /*
    loop through the whole thing only if lines are cleared.
    if not, only go through range of changed x
    start from the nearest y value possible
    */

    Isolate* isolate = args.GetIsolate();

    Grid* obj = ObjectWrap::Unwrap<Grid>(args.Holder());

    int holeCount = 0;
    for (int x = 0 ; x < obj->grid_[0].size() ; x++) {
        bool hitBlock = false;
        for (int y = 0 ; y < obj->grid_.size() ; y++) {
            if (obj->isRowFull(y)) {
                continue;
            }

            if (obj->grid_[y][x] != 0) {
                hitBlock = true;
            }
            if (hitBlock && obj->grid_[y][x] == 0) {
                holeCount++;
            }
        }
    }

    args.GetReturnValue().Set(Number::New(isolate, holeCount));
}

void Grid::getFullCount(const FunctionCallbackInfo<Value>& args) {

    // end at lowest possible y

    Isolate* isolate = args.GetIsolate();

    Grid* obj = ObjectWrap::Unwrap<Grid>(args.Holder());

    int fullCount = 0;
    for (int y = obj->grid_.size() - 1 ; y >= 0 ; y--) {
        if (obj->isRowFull(y)) {
            fullCount++;
        }
    }

    args.GetReturnValue().Set(Number::New(isolate, fullCount));
}

int Grid::getColHeight(int x) {
    int height = 0;
    for (int y = 0 ; y < grid_.size() ; y++) {
        bool full = isRowFull(y);
        if (grid_[y][x] != 0 && height == 0 && !full) {
            height = grid_.size() - y;
        }
        if (height > 0 && full) {
            height--;
        }
    }

    return height;
}

void Grid::getBumpiness(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();

    Grid* obj = ObjectWrap::Unwrap<Grid>(args.Holder());

    int bumpiness = 0;
    int prevHeight = -1;
    for (int x = 0 ; x < obj->grid_[0].size() ; x++) {
        int height = obj->getColHeight(x);
        if (prevHeight != -1) {
            bumpiness += std::abs(height - prevHeight);
        }
        prevHeight = height;
    }

    args.GetReturnValue().Set(Number::New(isolate, bumpiness));
}

void Grid::getRowsWithHoles(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();

    Grid* obj = ObjectWrap::Unwrap<Grid>(args.Holder());

    std::vector<int> rows;

    for (int x = 0 ; x < obj->grid_[0].size() ; x++) {
        bool hitBlock = false;
        for (int y = 0 ; y < obj->grid_.size() ; y++) {
            if (obj->isRowFull(y)) {
                continue;
            }

            if (obj->grid_[y][x] != 0) {
                hitBlock = true;
            }

            bool usedY = false;
            for (int r : rows) {
                if (r == y) {
                    usedY = true;
                    break;
                }
            }
            if (usedY) {
                continue;
            }

            if (hitBlock && obj->grid_[y][x] == 0) {
                rows.push_back(y);
            }
        }
    }

    args.GetReturnValue().Set(Number::New(isolate, rows.size()));
}

void Grid::getGrid(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();

    Grid* obj = ObjectWrap::Unwrap<Grid>(args.Holder());

    Local<Array> result_grid = Array::New(isolate, obj->grid_.size());

    int y = 0;
    for (std::vector<int> row : obj->grid_) {
        int x = 0;
        Local<Array> result_row = Array::New(isolate, row.size());
        for (int i : row) {
            result_row->Set(x, Number::New(isolate, i));
            x++;
        }
        result_grid->Set(y, result_row);
        y++;
    }

    args.GetReturnValue().Set(result_grid);
}

}  // namespace demo