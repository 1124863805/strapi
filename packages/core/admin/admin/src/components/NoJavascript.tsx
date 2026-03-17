const styles = `
.leao--root {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: #fff;
}

.leao--no-js {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
`;

/**
 * @internal
 *
 * @description this belongs to our default document that we render.
 */
const NoJavascript = () => {
  return (
    <noscript>
      <div className="leao--root">
        <div className="leao--no-js">
          <style type="text/css" dangerouslySetInnerHTML={{ __html: styles }} />
          <h1>JavaScript 已禁用</h1>
          <p>
            请在浏览器设置中启用 JavaScript 并刷新页面后继续使用。
          </p>
        </div>
      </div>
    </noscript>
  );
};

export { NoJavascript };
