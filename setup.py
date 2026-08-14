from setuptools import setup, find_packages

setup(
    name="hermes-agent",
    version="0.1.0",
    description="Hermes agent core binaries and tools",
    packages=find_packages(exclude=("tests", "docs")),
    include_package_data=True,
    install_requires=[],  # keep minimal; use setup-hermes.sh to install extras
    entry_points={
        'console_scripts': [
            'hermes=cli:main'
        ]
    }
)
