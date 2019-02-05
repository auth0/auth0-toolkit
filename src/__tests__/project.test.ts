import project from "../project";

describe("Project", () => {
  it("ensures tests are working", () => {
    expect(project.package.name).toEqual("auth0-toolkit");
  });
});
