import * as React from "react";
import { storiesOf } from "@storybook/react";
import { Box } from "./Box";

storiesOf("Component", module)
  .add("Box1", () => <Box>サンプル</Box>)
  .add("Box2", () => <Box>追加</Box>);
