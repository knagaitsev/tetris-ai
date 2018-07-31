#include <node.h>
#include "Grid.h"

namespace tetris {

using v8::Local;
using v8::Object;

void InitAll(Local<Object> exports) {
  Grid::Init(exports);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, InitAll)

}