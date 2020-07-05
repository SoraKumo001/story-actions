import * as React from "react";
import { storiesOf } from "@storybook/react";
import { Box } from "./Box";

storiesOf("Component", module)
  .add("Box1", () => <Box>あああああ</Box>)
  .add("Box2", () => <Box>いいいい</Box>);
